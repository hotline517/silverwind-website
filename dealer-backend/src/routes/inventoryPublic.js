import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { statusFor } from '../lib/inventoryValidation.js';

// Public, unauthenticated, read-only — the website's customer-facing
// pages call this for products an admin has explicitly linked to a
// central-inventory item (see the "Linked inventory SKU" field on each
// product). Returns ONLY what a shopper is allowed to see: no warehouse
// breakdown, no change history, no internal notes, no admin fields.
export const inventoryPublicRouter = Router();

const lookupLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true, legacyHeaders: false });

const bodySchema = z.object({
  skus: z.array(z.string().trim().min(1)).min(1).max(500)
});

inventoryPublicRouter.post('/lookup', lookupLimiter, asyncHandler(async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Provide a "skus" array.' });

  const { rows } = await query(
    'select sku, price, total_stock from inventory_products where sku = any($1)',
    [parsed.data.skus]
  );

  const result = {};
  for (const r of rows) {
    result[r.sku] = {
      price: r.price == null ? null : Number(r.price),
      stock: r.total_stock,
      status: statusFor(r.total_stock)
    };
  }
  res.json({ products: result });
}));
