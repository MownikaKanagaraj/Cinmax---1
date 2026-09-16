import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nthyavlzdgucrldtgjeo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50aHlhdmx6ZGd1Y3JsZHRnamVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU3NTU2MDAsImV4cCI6MjEwMTMzMTYwMH0.XzL0nuUOnksJLgsT9tGlsi4-adHtosCjV4fk9-MXClc';

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectPaymentTransactions() {
  console.log('--- INSPECTING SUPABASE PAYMENT TRANSACTIONS ---');

  // Query 1: Direct select payment_transactions
  const { data: txs, error: txsErr } = await supabase
    .from('payment_transactions')
    .select('*');

  console.log('Query 1: payment_transactions count:', txs?.length, 'Error:', txsErr);
  if (txs && txs.length > 0) {
    console.log('Sample payment_transaction row:', txs[0]);
  }

  // Query 2: Join select with orders
  const { data: joinData, error: joinErr } = await supabase
    .from('payment_transactions')
    .select('*, orders(order_number, shipping_address, guest_email)');

  console.log('Query 2: Join select with orders Error:', joinErr);
  console.log('Query 2 Data count:', joinData?.length);
  if (joinData && joinData.length > 0) {
    console.log('Sample join row:', joinData[0]);
  }

  // Query 3: Select orders with payment status
  const { data: orders, error: ordersErr } = await supabase
    .from('orders')
    .select('id, order_number, status, payment_status, payment_method, payment_intent_id, grand_total, shipping_address, guest_email, created_at');

  console.log('Query 3: orders count:', orders?.length, 'Error:', ordersErr);
  if (orders && orders.length > 0) {
    console.log('Sample order row:', orders[0]);
  }
}

inspectPaymentTransactions();
