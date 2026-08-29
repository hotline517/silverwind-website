import { verifyAgentToken } from '../lib/auth.js';
import { query } from '../lib/db.js';
import { asyncHandler } from '../lib/asyncHandler.js';

// Server-side authorization — never trust a route just because the
// frontend hid a button. Every /api/admin/* request re-checks the token
// and re-checks the agent is still active on every call.
export const requireAgent = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.agent_session;
  const payload = token && verifyAgentToken(token);
  if (!payload) return res.status(401).json({ error: 'Not authenticated.' });

  const { rows } = await query('select id, full_name, email, role, active from agents where id = $1', [payload.sub]);
  const agent = rows[0];
  if (!agent || !agent.active) return res.status(401).json({ error: 'Not authenticated.' });

  req.agent = agent;
  next();
});

export function requireAdmin(req, res, next) {
  if (req.agent?.role !== 'admin') return res.status(403).json({ error: 'Admin only.' });
  next();
}
