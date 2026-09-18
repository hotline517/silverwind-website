import { Router } from 'express';
import { requireAgent, requireAdmin } from '../middleware/auth.js';

const router = Router();

// GET catalog items by kind (tires, mags, fourxfour)
router.get('/:kind', async (req, res) => {
  try {
    const { kind } = req.params;
    const db = req.app.locals.db;
    const result = await db.query(
      'SELECT id, data FROM catalog_items WHERE kind = $1 ORDER BY sort_order ASC, id ASC',
      [kind]
    );
    const items = result.rows.map(row => ({ id: row.id, ...row.data }));
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Add catalog item
router.post('/:kind', requireAgent, requireAdmin, async (req, res) => {
  try {
    const { kind } = req.params;
    const item = req.body;
    const id = item.id || `${kind}-${Date.now()}`;
    const db = req.app.locals.db;
    
    await db.query(
      `INSERT INTO catalog_items (id, kind, data) VALUES ($1, $2, $3)
       ON CONFLICT (id) DO UPDATE SET data = $3, updated_at = CURRENT_TIMESTAMP`,
      [id, kind, JSON.stringify(item)]
    );
    res.json({ ok: true, id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update catalog item (PATCH)
router.patch('/:kind/:id', requireAgent, requireAdmin, async (req, res) => {
  try {
    const { kind, id } = req.params;
    const updates = req.body;
    const db = req.app.locals.db;

    const existing = await db.query('SELECT data FROM catalog_items WHERE id = $1 AND kind = $2', [id, kind]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const mergedData = { ...existing.rows[0].data, ...updates };

    await db.query(
      'UPDATE catalog_items SET data = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 AND kind = $3',
      [JSON.stringify(mergedData), id, kind]
    );

    res.json({ ok: true, id, data: mergedData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Delete catalog item
router.delete('/:kind/:id', requireAgent, requireAdmin, async (req, res) => {
  try {
    const { kind, id } = req.params;
    const db = req.app.locals.db;
    await db.query('DELETE FROM catalog_items WHERE id = $1 AND kind = $2', [id, kind]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;