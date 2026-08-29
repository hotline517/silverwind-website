import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { query } from '../lib/db.js';
import { verifyPassword, signAgentToken } from '../lib/auth.js';
import { requireAgent } from '../middleware/requireAgent.js';
import { asyncHandler } from '../lib/asyncHandler.js';

export const agentAuthRouter = Router();

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 8 * 60 * 60 * 1000
};

agentAuthRouter.post('/login', loginLimiter, asyncHandler(async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password are required.' });

  const { rows } = await query('select * from agents where email = $1 and active', [String(email).trim().toLowerCase()]);
  const agent = rows[0];
  // Same message whether the email doesn't exist or the password is wrong —
  // don't let a login form confirm which accounts exist.
  const wrong = () => res.status(401).json({ error: 'Incorrect email or password.' });
  if (!agent) return wrong();

  const ok = await verifyPassword(password, agent.password_hash);
  if (!ok) return wrong();

  const token = signAgentToken(agent);
  res.cookie('agent_session', token, COOKIE_OPTS);
  await query('update agents set last_login_at = now() where id = $1', [agent.id]);
  res.json({ ok: true, agent: { id: agent.id, full_name: agent.full_name, email: agent.email, role: agent.role } });
}));

agentAuthRouter.post('/logout', (req, res) => {
  res.clearCookie('agent_session', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.json({ ok: true });
});

agentAuthRouter.get('/me', requireAgent, (req, res) => {
  res.json({ agent: req.agent });
});
