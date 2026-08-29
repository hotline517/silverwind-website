import { Router } from 'express';
import { z } from 'zod';
import { query } from '../lib/db.js';
import { requireAgent, requireAdmin } from '../middleware/requireAgent.js';
import { asyncHandler } from '../lib/asyncHandler.js';
import { hashPassword } from '../lib/auth.js';

// Agent accounts are managed ONLY from here — the Admin Panel's Agents tab.
// There is no public agent registration, and the Dealer Application Portal
// has no create-account flow of its own; it only ever logs in against
// accounts this router created.
export const agentsRouter = Router();
agentsRouter.use(requireAgent, requireAdmin); // every route here is admin-only

const createSchema = z.object({
  full_name: z.string().trim().min(1, 'Name is required.'),
  email: z.string().trim().email('Enter a valid email.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
  role: z.enum(['agent', 'admin']).default('agent')
});

const updateSchema = z.object({
  full_name: z.string().trim().min(1).optional(),
  email: z.string().trim().email().optional(),
  role: z.enum(['agent', 'admin']).optional(),
  active: z.boolean().optional()
});

agentsRouter.get('/', asyncHandler(async (req, res) => {
  const { rows } = await query(
    'select id, full_name, email, role, active, created_at, last_login_at from agents order by full_name'
  );
  res.json({ agents: rows });
}));

agentsRouter.post('/', asyncHandler(async (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { full_name, email, password, role } = parsed.data;

  const password_hash = await hashPassword(password);
  try {
    const { rows: [agent] } = await query(
      `insert into agents (full_name, email, password_hash, role)
       values ($1,$2,$3,$4)
       returning id, full_name, email, role, active, created_at, last_login_at`,
      [full_name, email.toLowerCase(), password_hash, role]
    );
    res.status(201).json({ ok: true, agent });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'An account with that email already exists.' });
    throw err;
  }
}));

agentsRouter.patch('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  if (id === req.agent.id && parsed.data.active === false) {
    return res.status(400).json({ error: "You can't disable your own account." });
  }
  if (id === req.agent.id && parsed.data.role === 'agent') {
    return res.status(400).json({ error: "You can't demote your own account." });
  }

  const fields = Object.keys(parsed.data);
  if (!fields.length) return res.status(400).json({ error: 'Nothing to update.' });
  const set = fields.map((f, i) => `${f} = $${i + 2}`).join(', ');
  const values = fields.map(f => parsed.data[f]);

  try {
    const { rows: [agent] } = await query(
      `update agents set ${set} where id = $1 returning id, full_name, email, role, active, created_at, last_login_at`,
      [id, ...values]
    );
    if (!agent) return res.status(404).json({ error: 'Agent not found.' });
    res.json({ ok: true, agent });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'An account with that email already exists.' });
    throw err;
  }
}));

agentsRouter.post('/:id/reset-password', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body ?? {};
  if (!password || password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  const password_hash = await hashPassword(password);
  const { rowCount } = await query('update agents set password_hash = $1 where id = $2', [password_hash, id]);
  if (!rowCount) return res.status(404).json({ error: 'Agent not found.' });
  res.json({ ok: true });
}));

agentsRouter.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (id === req.agent.id) return res.status(400).json({ error: "You can't delete your own account." });

  try {
    const { rowCount } = await query('delete from agents where id = $1', [id]);
    if (!rowCount) return res.status(404).json({ error: 'Agent not found.' });
    res.json({ ok: true });
  } catch (err) {
    // FK violation — this agent has notes, status history, or assigned
    // applications on record. Deleting would silently erase audit trail
    // attribution, so we refuse and point at the reversible alternative.
    if (err.code === '23503') {
      return res.status(409).json({ error: 'This agent has application history on record — disable the account instead of deleting it.' });
    }
    throw err;
  }
}));
