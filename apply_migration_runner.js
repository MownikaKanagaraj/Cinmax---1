const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const clusters = [
  'aws-0-ap-south-1.pooler.supabase.com',
  'aws-1-ap-south-1.pooler.supabase.com',
  'aws-0-ap-southeast-1.pooler.supabase.com',
  'aws-1-ap-southeast-1.pooler.supabase.com',
  'aws-0-us-east-1.pooler.supabase.com',
  'aws-1-us-east-1.pooler.supabase.com',
  'aws-0-eu-west-1.pooler.supabase.com',
  'aws-1-eu-west-1.pooler.supabase.com',
  'aws-0-eu-central-1.pooler.supabase.com',
  'aws-1-eu-central-1.pooler.supabase.com'
];

const pass = 'Inaiyam@2025';
const projectRef = 'nthyavlzdgucrldtgjeo';
const user = `postgres.${projectRef}`;

async function scanPoolerClusters() {
  const filePath = path.join(__dirname, 'supabase/migrations/20260907000001_loyalty_system.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  for (const host of clusters) {
    for (const port of [6543, 5432]) {
      console.log(`Connecting ${user}@${host}:${port}...`);
      const client = new Client({
        host,
        port,
        user,
        password: pass,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000,
      });

      try {
        await client.connect();
        console.log(`🎉🎉🎉 MATCH FOUND ON ${host}:${port}! 🎉🎉🎉`);
        console.log('Applying 20260907000001_loyalty_system.sql...');
        await client.query('BEGIN;');
        await client.query(sql);
        await client.query('COMMIT;');
        console.log('✅ LOYALTY MIGRATION APPLIED SUCCESSFULLY TO SUPABASE DB!');
        await client.end();
        return true;
      } catch (e) {
        if (!e.message.includes('not found') && !e.message.includes('ENOTFOUND')) {
          console.log(`>>> RESPONSE ON ${host}:${port} -> ${e.message}`);
        }
        await client.end().catch(() => {});
      }
    }
  }
}

scanPoolerClusters().catch(console.error);
