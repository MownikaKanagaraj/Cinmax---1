const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

async function checkExistingRpcs() {
  const headers = {
    'apikey': SERVICE_KEY,
    'Authorization': `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
  };

  const rpcs = ['is_admin', 'exec_sql', 'execute_sql', 'query', 'sql'];
  for (const rpc of rpcs) {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${rpc}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({}),
      });
      const text = await res.text();
      console.log(`RPC ${rpc} status:`, res.status, text.slice(0, 150));
    } catch (e) {
      console.log(`RPC ${rpc} err:`, e.message);
    }
  }
}

checkExistingRpcs();
