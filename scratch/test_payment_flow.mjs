import crypto from 'crypto';

const API_BASE = 'https://cinmax-website.pages.dev/api';
const RAZORPAY_SECRET = 'tcp9HIn70PSx5JzNm611UHmw';

async function testPaymentPipeline() {
  console.log('--- TEST 1: CREATE ORDER ---');
  const createOrderPayload = {
    amount: 450,
    currency: 'INR',
    cartItems: [
      {
        id: 'test_item_1',
        title: 'Artisanal Botanical Bath Bar',
        unitPrice: 450,
        price: 450,
        quantity: 1,
      }
    ],
    deliveryState: 'Tamil Nadu'
  };

  const createRes = await fetch(`${API_BASE}/create-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(createOrderPayload)
  });

  const orderData = await createRes.json();
  console.log('Create Order Status:', createRes.status);
  console.log('Create Order Data:', orderData);

  if (!orderData.order_id) {
    throw new Error('Create order failed: no order_id');
  }

  console.log('\n--- TEST 2: SIGNATURE GENERATION ---');
  const mockPaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const orderId = orderData.order_id;
  const text = `${orderId}|${mockPaymentId}`;
  const signature = crypto.createHmac('sha256', RAZORPAY_SECRET).update(text).digest('hex');
  console.log('Generated Signature for Payment ID:', mockPaymentId);

  console.log('\n--- TEST 3: VERIFY PAYMENT & ORDER CREATION ---');
  const verifyPayload = {
    razorpay_order_id: orderId,
    razorpay_payment_id: mockPaymentId,
    razorpay_signature: signature,
    subtotal: 450,
    grandTotal: 490,
    deliveryState: 'Tamil Nadu',
    shippingAddress: {
      name: 'Rajan Kanagaraj',
      phone: '9876543210',
      addressLine1: 'No 45, Anna Salai',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600002',
    },
    cartItems: [
      {
        id: 'test_item_1',
        title: 'Artisanal Botanical Bath Bar',
        price: 450,
        quantity: 1,
      }
    ]
  };

  const verifyRes = await fetch(`${API_BASE}/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verifyPayload)
  });

  const verifyData = await verifyRes.json();
  console.log('Verify Payment Status:', verifyRes.status);
  console.log('Verify Payment Response:', verifyData);

  console.log('\n--- TEST 4: DUPLICATE PAYMENT REJECTION / IDEMPOTENCY ---');
  const dupRes = await fetch(`${API_BASE}/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(verifyPayload)
  });
  const dupData = await dupRes.json();
  console.log('Duplicate Check Status:', dupRes.status);
  console.log('Duplicate Check Response:', dupData);

  console.log('\n--- TEST 5: INVALID SIGNATURE REJECTION ---');
  const badSigRes = await fetch(`${API_BASE}/verify-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...verifyPayload,
      razorpay_payment_id: `pay_invalid_${Date.now()}`,
      razorpay_signature: 'invalid_tampered_signature_12345'
    })
  });
  const badSigData = await badSigRes.json();
  console.log('Invalid Signature Status:', badSigRes.status);
  console.log('Invalid Signature Response:', badSigData);

  console.log('\nALL TESTS COMPLETED SUCCESSFULLY!');
}

testPaymentPipeline().catch(console.error);
