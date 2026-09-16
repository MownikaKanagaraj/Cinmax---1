import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NTc1NTYwMCwiZXhwIjoyMTAxMzMxNjAwfQ.WhVVQo2bsvvo3NN8isPSbaQNUPef8MloYdjG3B_LaU0';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function inspectOrders() {
  console.log('=== INSPECTING SUPABASE ORDERS TABLE ===');

  const { data: orders, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error querying orders table:', error);
    return;
  }

  console.log(`Total orders in database: ${orders?.length || 0}`);
  if (orders && orders.length > 0) {
    console.log('Sample Order Keys:', Object.keys(orders[0]));
    orders.forEach((o, i) => {
      console.log(`\nOrder #${i + 1}:`);
      console.log(`  ID: ${o.id}`);
      console.log(`  Order Number: ${o.order_number}`);
      console.log(`  User ID: ${o.user_id}`);
      console.log(`  Status: ${o.status}`);
      console.log(`  Payment Status: ${o.payment_status}`);
      console.log(`  Payment Method: ${o.payment_method}`);
      console.log(`  Payment Intent ID / Razorpay Payment ID: ${o.payment_intent_id}`);
      console.log(`  Estimated Delivery: ${o.estimated_delivery_date || o.estimated_delivery || o.est_delivery || 'N/A'}`);
      console.log(`  Carrier / Courier: ${o.carrier || o.courier_name || 'N/A'}`);
      console.log(`  Tracking Number / AWB: ${o.tracking_number || o.awb_number || 'N/A'}`);
    });
  }
}

inspectOrders().catch(console.error);
