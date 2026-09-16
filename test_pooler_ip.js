const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const host = 'aws-0-ap-south-1.pooler.supabase.com';
const projectRef = 'nthyavlzdgucrldtgjeo';

const passVariants = [
  'Inaiyam@2025',
  'Inaiyam2025',
  'Inaiyam%402025'
];

const userVariants = [
  `postgres.${projectRef}`,
  `postgres`,
  `authenticated`
];

async function testCombinations() {
  const filePath = path.join(__dirname, 'supabase/migrations/20260907000001_loyalty_system.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  for (const port of [6543, 5432]) {
    for (const u of userVariants) {
      for (const p of passVariants) {
        console.log(`Testing user=${u}, port=${port}, pass=${p.slice(0, 4)}...`);
        const client = new Client({
          host,
          port,
          user: u,
          password: p,
          database: 'postgres',
          options: `reference=${projectRef}`,
          ssl: { rejectUnauthorized: false },
          connectionTimeoutMillis: 3000,
        });

        try {
          await client.connect();
          console.log(`🎉🎉🎉 SUCCESS! CONNECTED WITH user=${u}, port=${port}! 🎉🎉🎉`);
          console.log('Applying migration 20260907000001_loyalty_system.sql...');
          await client.query('BEGIN;');
          await client.query(sql);
          await client.query('COMMIT;');
          console.log('✅ LOYALTY MIGRATION APPLIED SUCCESSFULLY TO SUPABASE DB!');
          await client.end();
          return true;
        } catch (e) {
          console.log(`Failed user=${u}, port=${port} -> ${e.message}`);
          await client.end().catch(() => {});
        }
      }
    }
  }
}

testCombinations().catch(console.error);
