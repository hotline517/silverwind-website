import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

function arg(name) {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : undefined;
}

const email = arg('email');
const password = arg('password');
const fullName = arg('name');
const role = arg('role') || 'agent';

if (!email || !password || !fullName) {
  console.error('Usage: node scripts/create-agent.js --email=you@x.com --password=secret --name="Full Name" --role=admin');
  process.exit(1);
}
if (!['agent', 'admin'].includes(role)) {
  console.error('--role must be "agent" or "admin"');
  process.exit(1);
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined
});
await client.connect();

const hash = await bcrypt.hash(password, 12);
const { rows } = await client.query(
  `insert into agents (full_name, email, password_hash, role)
   values ($1, $2, $3, $4)
   on conflict (email) do update set password_hash = excluded.password_hash, full_name = excluded.full_name, role = excluded.role
   returning id, email, role`,
  [fullName, email.toLowerCase(), hash, role]
);
console.log('Agent ready:', rows[0]);
await client.end();