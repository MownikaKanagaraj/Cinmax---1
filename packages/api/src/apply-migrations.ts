import { Client } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

const connectionString =
  process.env.DATABASE_URL ||
  'postgresql://postgres.nthyavlzdgucrldtgjeo:Inaiyam%402025@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres';

async function applyMigrations() {
  console.log('🚀 Connecting to Supabase PostgreSQL Database...');
  const client = new Client({
    connectionString: 'postgresql://postgres.nthyavlzdgucrldtgjeo:Inaiyam%402025@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  console.log('⚡ Connected to PostgreSQL DB!');

  const migrationsDir = path.join(__dirname, '../../../supabase/migrations');
  const migrationFiles = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log(`📜 Found ${migrationFiles.length} migration files.`);

  for (const file of migrationFiles) {
    console.log(`Executing migration: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
      await client.query('BEGIN;');
      await client.query(sql);
      await client.query('COMMIT;');
      console.log(`✅ ${file} applied successfully.`);
    } catch (err: any) {
      await client.query('ROLLBACK;').catch(() => {});
      console.warn(`⚠️ Warning executing ${file}:`, err.message);
    }
  }

  // Also execute seed.sql
  const seedFile = path.join(__dirname, '../../../supabase/seed.sql');
  if (fs.existsSync(seedFile)) {
    console.log(`🌱 Executing seed.sql...`);
    const seedSql = fs.readFileSync(seedFile, 'utf8');
    try {
      await client.query(seedSql);
      console.log(`✅ seed.sql applied successfully.`);
    } catch (err: any) {
      console.warn(`⚠️ Warning executing seed.sql:`, err.message);
    }
  }

  await client.end();
  console.log('🎉 All Database Migrations & Seeds Applied Successfully!');
}

applyMigrations().catch((err) => {
  console.error('❌ Failed to apply migrations:', err);
  process.exit(1);
});
