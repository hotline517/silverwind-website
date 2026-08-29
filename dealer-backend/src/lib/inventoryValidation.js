import { z } from 'zod';

// Numeric price only — never a formatted currency string like "₱8,500".
// The UI formats for display; the database stores a plain decimal.
export const priceSchema = z.union([
  z.null(),
  z.number().finite().nonnegative().max(9999999.99, 'Price is too large.')
]);

export const stockSchema = z.number().int().nonnegative().max(999999, 'Stock is too large.');

export const manualUpdateSchema = z.object({
  price: priceSchema.optional(),
  total_stock: stockSchema.optional()
}).refine(v => v.price !== undefined || v.total_stock !== undefined, {
  message: 'Nothing to update.'
});

// Column names actually seen across real exports, matched case-insensitively.
// Extend this list if a future export uses a different header — never guess
// silently, the import route reports exactly which header (if any) matched.
export const PRICE_HEADER_CANDIDATES = ['price', 'unit price', 'srp', 'selling price', 'dealer price'];
export const STOCK_HEADER_CANDIDATES = ['quantity in warehouse', 'stock', 'quantity'];

export function findHeader(headers, candidates) {
  const lower = headers.map(h => h.trim().toLowerCase());
  for (const c of candidates) {
    const idx = lower.indexOf(c);
    if (idx !== -1) return headers[idx];
  }
  return null;
}

// Shared business rule (also used by the public lookup endpoint the
// website reads, and — later — the chatbot): below 20 is low stock,
// zero is out of stock.
export function statusFor(stock) {
  if (stock <= 0) return 'OUT_OF_STOCK';
  if (stock < 20) return 'LOW_STOCK';
  return 'IN_STOCK';
}
