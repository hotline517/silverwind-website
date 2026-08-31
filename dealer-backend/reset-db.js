import pkg from 'pg';
const { Client } = pkg;

const connectionString = 'postgresql://silverwind_db_2026_user:7DYAeWUWXbfvVf6rZmGhkUF4JMsV8Av1@dpg-daa1kuks728c73f4cnag-a.singapore-postgres.render.com/silverwind_db_2026';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function resetDatabase() {
  try {
    await client.connect();
    console.log('Connected to database. Dropping old tables and types...');

    // Drop tables and types in correct order to avoid foreign key conflicts
    await client.query(`
      DROP TABLE IF EXISTS application_notes CASCADE;
      DROP TABLE IF EXISTS application_status_history CASCADE;
      DROP TABLE IF EXISTS application_references CASCADE;
      DROP TABLE IF EXISTS application_documents CASCADE;
      DROP TABLE IF EXISTS dealer_applications CASCADE;
      DROP TABLE IF EXISTS agents CASCADE;
      DROP TABLE IF EXISTS application_counters CASCADE;
      DROP TABLE IF EXISTS inventory_change_history CASCADE;
      DROP TABLE IF EXISTS inventory_stock_by_warehouse CASCADE;
      DROP TABLE IF EXISTS inventory_products CASCADE;

      DROP TYPE IF EXISTS application_status CASCADE;
      DROP TYPE IF EXISTS property_status CASCADE;
      DROP TYPE IF EXISTS agent_role CASCADE;
      DROP TYPE IF EXISTS inventory_change_field CASCADE;
      DROP TYPE IF EXISTS inventory_change_source CASCADE;
    `);

    console.log('Database successfully wiped clean! You can now redeploy on Render.');
  } catch (err) {
    console.error('Error resetting database:', err);
  } finally {
    await client.end();
  }
}

resetDatabase();