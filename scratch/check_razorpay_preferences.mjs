import fetch from 'node-fetch';

const key = 'rzp_test_TX6kmNNGbn83QI';
const secret = 'tcp9HIn70PSx5JzNm611UHmw';
const auth = Buffer.from(`${key}:${secret}`).toString('base64');

async function check() {
  console.log('--- 1. Testing Order Creation on Razorpay API ---');
  const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 51000,
      currency: 'INR',
      receipt: 'test_rcpt_' + Date.now()
    })
  });
  const order = await orderRes.json();
  console.log('Order status:', orderRes.status);
  console.log('Order result:', order);

  console.log('\n--- 2. Testing Public Checkout Preferences (what checkout.js calls) ---');
  const prefRes = await fetch(`https://api.razorpay.com/v1/checkout/public?key_id=${key}&order_id=${order.id}`);
  const pref = await prefRes.json();
  console.log('Preferences status:', prefRes.status);
  console.log('Preferences result:', JSON.stringify(pref, null, 2));

  console.log('\n--- 3. Testing Contact / Customer validation endpoint ---');
  const contactRes = await fetch(`https://api.razorpay.com/v1/checkout/preferences?key_id=${key}&order_id=${order.id}`);
  console.log('Preferences endpoint status:', contactRes.status);
  const contactJson = await contactRes.json().catch(() => ({}));
  console.log('Preferences endpoint body:', contactJson);
}

check().catch(console.error);
