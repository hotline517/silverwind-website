import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const dir = path.resolve(process.cwd(), 'migrations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

await client.connect();
try {
  for (const file of files) {
    console.log(`Applying ${file}...`);
    const sql = fs.readFileSync(path.join(dir, file), 'utf8');
    await client.query(sql);
  }

  // Auto-create default admin agent if not exists
  const adminEmail = 'admin@silverwind.website';
  const checkAdmin = await client.query('SELECT id FROM agents WHERE email = $1', [adminEmail]);
  
  if (checkAdmin.rows.length === 0) {
    console.log('Creating default admin account...');
    const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);
  await client.query(
  `INSERT INTO agents (full_name, email, password_hash, role, active) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING`,
  ['Super Admin', adminEmail, hashedPassword, 'admin', true]
);
    console.log('Default admin created successfully (Email: admin@silverwind.website, Pass: AdminPassword123!).');
  }

  console.log('Migration and seeding completed successfully.');
} catch (err) {
  console.error('Migration failed:', err);
  process.exit(1);
} finally {
  await client.end();
}
