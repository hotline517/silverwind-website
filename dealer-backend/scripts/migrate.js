import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const dir = path.resolve(process.cwd(), 'migrations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort();

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

await client.connect();
for (const file of files) {
  console.log(`Applying ${file}...`);
  const sql = fs.readFileSync(path.join(dir, file), 'utf8');
  await client.query(sql);
}
console.log('Done.');
await client.end();