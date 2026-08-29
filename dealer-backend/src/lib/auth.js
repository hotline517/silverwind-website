import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not set — copy .env.example to .env and fill it in.');
}

const SECRET = process.env.JWT_SECRET;
const TOKEN_TTL = '8h';

export const hashPassword = (plain) => bcrypt.hash(plain, 12);
export const verifyPassword = (plain, hash) => bcrypt.compare(plain, hash);

export function signAgentToken(agent) {
  return jwt.sign({ sub: agent.id, role: agent.role }, SECRET, { expiresIn: TOKEN_TTL });
}

export function verifyAgentToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
