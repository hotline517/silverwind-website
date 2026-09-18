import { Router } from 'express';
import pg from 'pg';
import { requireAgent, requireAdmin } from '../middleware/auth.js';

const router = Router();
const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});
// (Siguraduhing naka-connect ang db o gamitin ang existing db pool mo)

// Basahin ang catalog base sa kind (tires, mags, fourxfour)
router.get('/:kind', async (req, res) => {
  try {
    const { kind } = req.params;
    const pool = req.app.locals.db; // o ang db client mo
    // Ibalik ang data mula sa catalog_items table
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;