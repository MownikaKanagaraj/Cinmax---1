import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkRecent() {
  const { data: txs, error: txErr } = await supabase
    .from('payment_transactions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('Recent payment transactions:', txs);

  const { data: orders, error: oErr } = await supabase
    .from('orders')
    .select('id, order_number, status, payment_status, created_at, grand_total')
    .order('created_at', { ascending: false })
    .limit(5);

  console.log('Recent orders:', orders);
}

checkRecent().catch(console.error);
