import fetch from 'node-fetch';

const key = 'rzp_test_TX6kmNNGbn83QI';
const secret = 'tcp9HIn70PSx5JzNm611UHmw';
const auth = Buffer.from(`${key}:${secret}`).toString('base64');

async function testCheckoutFlow() {
  // 1. Create order
  const orderRes = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + auth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: 51000,
      currency: 'INR',
      receipt: 'rcpt_' + Date.now()
    })
  });
  const order = await orderRes.json();
  console.log('Order created:', order.id);

  // 2. Test payments/create/checkout without auth (how checkout.js frontend calls it)
  const payRes = await fetch('https://api.razorpay.com/v1/payments/create/checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      key_id: key,
      order_id: order.id,
      amount: 51000,
      currency: 'INR',
      contact: '9876543210',
      email: 'customer@cinmax.com',
      method: 'card'
    })
  });

  console.log('payments/create/checkout status:', payRes.status);
  const payData = await payRes.json();
  console.log('payments/create/checkout response:', JSON.stringify(payData, null, 2));
}

testCheckoutFlow().catch(console.error);
