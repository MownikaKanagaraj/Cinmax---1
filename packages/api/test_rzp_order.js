const Razorpay = require('razorpay');

const rzp = new Razorpay({
  key_id: 'rzp_test_TX6kmNNGbn83QI',
  key_secret: 'tcp9HIn70PSx5JzNm611UHmw',
});

async function testCreateOrder() {
  try {
    const order = await rzp.orders.create({
      amount: 46350,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });
    console.log('✅ REAL RAZORPAY ORDER CREATED SUCCESSFULLY:', order);
  } catch (err) {
    console.error('❌ RAZORPAY ORDER CREATION ERROR:', err);
  }
}

testCreateOrder();
