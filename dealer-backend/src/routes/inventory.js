import { Router } from 'express';
import multer from 'multer';
import { parse } from 'csv-parse/sync';
import { query, withTransaction } from '../lib/db.js';
import { requireAgent, requireAdmin } from '../middleware/requireAgent.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { manualUpdateSchema, findHeader, PRICE_HEADER_CANDIDATES, STOCK_HEADER_CANDIDATES, statusFor } from '../lib/inventoryValidation.js';

export const inventoryRouter = Router();
inventoryRouter.use(requireAgent, requireAdmin); // Admin Panel only — agents never see inventory/price

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

inventoryRouter.get('/', asyncHandler(async (req, res) => {
  const { q, type } = req.query;
  const clauses = [];
  const params = [];
  if (q) { params.push(`%${q}%`); clauses.push(`(sku ilike $${params.length} or name ilike $${params.length})`); }
  if (type) { params.push(type); clauses.push(`item_type = $${params.length}`); }
  const where = clauses.length ? `where ${clauses.join(' and ')}` : '';

  const { rows } = await query(
    `select id, sku, name, item_type, brand, size, price, total_stock, updated_at
     from inventory_products ${where} order by updated_at desc limit 500`,
    params
  );
  res.json({ products: rows.map(p => ({ ...p, status: statusFor(p.total_stock) })) });
}));

inventoryRouter.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rows: [product] } = await query('select * from inventory_products where id = $1', [id]);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const [{ rows: warehouses }, { rows: history }] = await Promise.all([
    query('select warehouse, quantity from inventory_stock_by_warehouse where product_id = $1 order by warehouse', [id]),
    query(
      `select h.field, h.old_value, h.new_value, h.source, h.created_at, ag.full_name as changed_by_name
       from inventory_change_history h left join agents ag on ag.id = h.changed_by
       where h.product_id = $1 order by h.created_at desc limit 100`, [id]
    )
  ]);
  res.json({ product: { ...product, status: statusFor(product.total_stock) }, warehouses, history });
}));

inventoryRouter.patch('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = manualUpdateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });

  const { rows: [current] } = await query('select price, total_stock from inventory_products where id = $1', [id]);
  if (!current) return res.status(404).json({ error: 'Product not found.' });

  const sets = [];
  const values = [];
  const historyRows = [];

  if (parsed.data.price !== undefined && Number(current.price) !== parsed.data.price) {
    values.push(parsed.data.price);
    sets.push(`price = $${values.length}`);
    historyRows.push(['price', current.price, parsed.data.price]);
  }
  if (parsed.data.total_stock !== undefined && current.total_stock !== parsed.data.total_stock) {
    values.push(parsed.data.total_stock);
    sets.push(`total_stock = $${values.length}`);
    historyRows.push(['stock', current.total_stock, parsed.data.total_stock]);
  }

  if (!sets.length) return res.json({ ok: true, unchanged: true });

  values.push(id);
  const { rows: [updated] } = await query(
    `update inventory_products set ${sets.join(', ')}, updated_at = now() where id = $${values.length} returning *`,
    values
  );
  for (const [field, oldV, newV] of historyRows) {
    await query(
      `insert into inventory_change_history (product_id, field, old_value, new_value, source, changed_by)
       values ($1,$2,$3,$4,'ADMIN_MANUAL',$5)`,
      [id, field, oldV == null ? null : String(oldV), String(newV), req.agent.id]
    );
  }
  res.json({ ok: true, product: { ...updated, status: statusFor(updated.total_stock) } });
}));

// CSV import — upserts by SKU (Item Code). Stock is summed per warehouse
// and totalled; price is left untouched (no source column in the real
// exports) unless a recognized price header is actually present.
inventoryRouter.post('/import', upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  let records;
  try {
    records = parse(req.file.buffer, { columns: true, skip_empty_lines: true, trim: true, bom: true });
  } catch {
    return res.status(400).json({ error: "Couldn't read that file — make sure it's a valid CSV." });
  }
  if (!records.length) return res.status(400).json({ error: 'The CSV has no rows.' });

  const headers = Object.keys(records[0]);
  const skuHeader = findHeader(headers, ['item code', 'sku']);
  const nameHeader = findHeader(headers, ['item name', 'name', 'product name']);
  if (!skuHeader || !nameHeader) {
    return res.status(400).json({ error: `CSV is missing a required column. Found columns: ${headers.join(', ')}. Need an "Item Code" (SKU) and an "Item Name" column.` });
  }
  const priceHeader = findHeader(headers, PRICE_HEADER_CANDIDATES);
  const stockHeader = findHeader(headers, STOCK_HEADER_CANDIDATES) || 'Quantity in warehouse';
  const typeHeader = findHeader(headers, ['type']);
  const warehouseHeader = findHeader(headers, ['warehouse']);
  const brandHeader = findHeader(headers, ['brand']);
  const sizeHeader = findHeader(headers, ['size']);
  const holesHeader = findHeader(headers, ['holes']);
  const colorHeader = findHeader(headers, ['color', 'colour']);
  const pcdHeader = findHeader(headers, ['pcd']);
  const offsetHeader = findHeader(headers, ['offset']);
  const boreHeader = findHeader(headers, ['bore']);
  const specHeader = findHeader(headers, ['specifications']);

  // Group rows by SKU first — a single product legitimately spans multiple
  // warehouse rows in these exports (confirmed in the real tire export).
  const bySku = new Map();
  for (const row of records) {
    const sku = String(row[skuHeader] ?? '').trim();
    if (!sku) continue;
    if (!bySku.has(sku)) bySku.set(sku, { rows: [], totalStock: 0 });
    const entry = bySku.get(sku);
    entry.rows.push(row);
    const qty = parseInt(row[stockHeader], 10);
    entry.totalStock += Number.isFinite(qty) ? qty : 0;
  }

  let created = 0, updated = 0, stockChanged = 0;
  const skippedRows = records.length - [...bySku.values()].reduce((n, e) => n + e.rows.length, 0);

  await withTransaction(async (client) => {
    for (const [sku, entry] of bySku) {
      const first = entry.rows[0];
      const name = String(first[nameHeader] ?? '').trim() || sku;
      const priceRaw = priceHeader ? first[priceHeader] : undefined;
      const priceValue = priceRaw != null && String(priceRaw).trim() !== ''
        ? Number(String(priceRaw).replace(/[^0-9.\-]/g, ''))
        : undefined;

      const { rows: [existing] } = await client.query('select id, price, total_stock from inventory_products where sku = $1', [sku]);

      let productId;
      if (!existing) {
        const { rows: [inserted] } = await client.query(
          `insert into inventory_products
            (sku, name, item_type, brand, size, holes, color, pcd, "offset", bore, specifications, price, total_stock)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) returning id`,
          [sku, name, typeHeader ? first[typeHeader] : null, brandHeader ? first[brandHeader] || null : null,
           sizeHeader ? first[sizeHeader] || null : null, holesHeader ? first[holesHeader] || null : null,
           colorHeader ? first[colorHeader] || null : null, pcdHeader ? first[pcdHeader] || null : null,
           offsetHeader ? first[offsetHeader] || null : null, boreHeader ? first[boreHeader] || null : null,
           specHeader ? first[specHeader] || null : null,
           (priceValue != null && Number.isFinite(priceValue)) ? priceValue : null,
           entry.totalStock]
        );
        productId = inserted.id;
        created++;
        if (entry.totalStock !== 0) {
          await client.query(
            `insert into inventory_change_history (product_id, field, old_value, new_value, source) values ($1,'stock',NULL,$2,'CSV_IMPORT')`,
            [productId, String(entry.totalStock)]
          );
        }
      } else {
        productId = existing.id;
        const sets = ['name = $2', 'updated_at = now()'];
        const values = [productId, name];
        if (typeHeader) { values.push(first[typeHeader] || null); sets.push(`item_type = $${values.length}`); }
        if (brandHeader) { values.push(first[brandHeader] || null); sets.push(`brand = $${values.length}`); }
        if (sizeHeader) { values.push(first[sizeHeader] || null); sets.push(`size = $${values.length}`); }
        if (holesHeader) { values.push(first[holesHeader] || null); sets.push(`holes = $${values.length}`); }
        if (colorHeader) { values.push(first[colorHeader] || null); sets.push(`color = $${values.length}`); }
        if (pcdHeader) { values.push(first[pcdHeader] || null); sets.push(`pcd = $${values.length}`); }
        if (offsetHeader) { values.push(first[offsetHeader] || null); sets.push(`"offset" = $${values.length}`); }
        if (boreHeader) { values.push(first[boreHeader] || null); sets.push(`bore = $${values.length}`); }
        if (specHeader) { values.push(first[specHeader] || null); sets.push(`specifications = $${values.length}`); }
        // Price: only ever touched if this CSV genuinely has a recognized
        // price column with a usable value — never blanked to null.
        if (priceValue != null && Number.isFinite(priceValue)) {
          values.push(priceValue);
          sets.push(`price = $${values.length}`);
        }
        values.push(entry.totalStock);
        sets.push(`total_stock = $${values.length}`);
        await client.query(`update inventory_products set ${sets.join(', ')} where id = $1`, values);
        updated++;

        if (existing.total_stock !== entry.totalStock) {
          stockChanged++;
          await client.query(
            `insert into inventory_change_history (product_id, field, old_value, new_value, source) values ($1,'stock',$2,$3,'CSV_IMPORT')`,
            [productId, String(existing.total_stock), String(entry.totalStock)]
          );
        }
        if (priceValue != null && Number.isFinite(priceValue) && Number(existing.price) !== priceValue) {
          await client.query(
            `insert into inventory_change_history (product_id, field, old_value, new_value, source) values ($1,'price',$2,$3,'CSV_IMPORT')`,
            [productId, existing.price, String(priceValue)]
          );
        }
      }

      // Per-warehouse breakdown, replacing whatever this SKU's warehouse
      // rows said last time (a warehouse absent from this import is left
      // as-is — the CSV represents "what we know," not "delete the rest").
      const byWarehouse = new Map();
      for (const row of entry.rows) {
        const wh = warehouseHeader ? String(row[warehouseHeader] ?? '').trim() || 'Unspecified' : 'Unspecified';
        const qty = parseInt(row[stockHeader], 10);
        byWarehouse.set(wh, (byWarehouse.get(wh) || 0) + (Number.isFinite(qty) ? qty : 0));
      }
      for (const [warehouse, quantity] of byWarehouse) {
        await client.query(
          `insert into inventory_stock_by_warehouse (product_id, warehouse, quantity) values ($1,$2,$3)
           on conflict (product_id, warehouse) do update set quantity = excluded.quantity`,
          [productId, warehouse, quantity]
        );
      }
    }
  });

  res.json({
    ok: true,
    priceColumnDetected: !!priceHeader,
    priceColumnName: priceHeader,
    rowsRead: records.length,
    rowsSkipped: skippedRows,
    productsCreated: created,
    productsUpdated: updated,
    stockChanges: stockChanged
  });
}));
