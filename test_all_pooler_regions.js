const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const regions = [
  'aws-0-ap-south-1',
  'aws-0-ap-south-2',
  'aws-0-ap-southeast-1',
  'aws-0-ap-southeast-2',
  'aws-0-ap-northeast-1',
  'aws-0-ap-northeast-2',
  'aws-0-eu-west-1',
  'aws-0-eu-west-2',
  'aws-0-eu-west-3',
  'aws-0-eu-central-1',
  'aws-0-eu-north-1',
  'aws-0-us-east-1',
  'aws-0-us-east-2',
  'aws-0-us-west-1',
  'aws-0-us-west-2',
  'aws-0-sa-east-1',
  'aws-0-ca-central-1'
];

const pass = 'Inaiyam@2025';
const projectRef = 'nthyavlzdgucrldtgjeo';

async function scanPoolers() {
  const filePath = path.join(__dirname, 'supabase/migrations/20260907000001_loyalty_system.sql');
  const sql = fs.readFileSync(filePath, 'utf8');

  for (const reg of regions) {
    const host = `${reg}.pooler.supabase.com`;
    for (const port of [6543, 5432]) {
      console.log(`Scanning ${host}:${port}...`);
      const client = new Client({
        host,
        port,
        user: 'postgres',
        password: pass,
        database: 'postgres',
        options: `reference=${projectRef}`,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 3000,
      });

      try {
        await client.connect();
        console.log(`🎉🎉🎉 MATCH FOUND! CONNECTED TO ${host}:${port}! 🎉🎉🎉`);
        console.log('Applying 20260907000001_loyalty_system.sql...');
        await client.query('BEGIN;');
        await client.query(sql);
        await client.query('COMMIT;');
        console.log('✅ LOYALTY MIGRATION APPLIED SUCCESSFULLY TO SUPABASE DB!');
        await client.end();
        return true;
      } catch (e) {
        if (!e.message.includes('not found')) {
          console.log(`>>> RESPONSE ON ${host}:${port} -> ${e.message}`);
          if (e.message.includes('password') || e.message.includes('authentication')) {
            console.log(`✅ TENANT FOUND ON ${host}:${port}! Auth error: ${e.message}`);
          }
        }
        await client.end().catch(() => {});
      }
    }
  }
}

scanPoolers().catch(console.error);
