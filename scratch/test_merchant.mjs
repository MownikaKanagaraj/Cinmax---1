import fetch from 'node-fetch';

const key = 'rzp_test_TX6kmNNGbn83QI';
const secret = 'tcp9HIn70PSx5JzNm611UHmw';
const auth = Buffer.from(`${key}:${secret}`).toString('base64');

async function test() {
  console.log('--- 1. Create order ---');
  const oRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: { 'Authorization': 'Basic ' + auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 51000, currency: 'INR', receipt: 'rcpt_1' })
  });
  const order = await oRes.json();
  console.log('Order:', order);

  console.log('--- 2. Fetch Merchant Details ---');
  const mRes = await fetch(`https://api.razorpay.com/v1/checkout/public?key_id=${key}&order_id=${order.id}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36' }
  });
  console.log('Merchant Checkout HTML Status:', mRes.status);
}

test().catch(console.error);
