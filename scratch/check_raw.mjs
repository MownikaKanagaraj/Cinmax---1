import fetch from 'node-fetch';

async function test() {
  const res = await fetch('https://api.razorpay.com/v1/checkout/public?key_id=rzp_test_TX6kmNNGbn83QI&order_id=order_Ti7iL01ifgkvJD');
  console.log('Status:', res.status);
  console.log('Headers:', res.headers.raw());
  const text = await res.text();
  console.log('Body length:', text.length);
  console.log('Body start:', text.slice(0, 300));
}

test().catch(console.error);
