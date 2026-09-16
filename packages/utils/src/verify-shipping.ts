import { calculateDeliveryCharge } from './shipping';

function assertEqual(actual: any, expected: any, message: string) {
  const aStr = JSON.stringify(actual);
  const eStr = JSON.stringify(expected);
  if (aStr !== eStr) {
    throw new Error(`[FAIL] ${message}\nExpected: ${eStr}\nActual:   ${aStr}`);
  }
  console.log(`[PASS] ${message}`);
}

console.log('--- RUNNING CINMAX DELIVERY CHARGE ALGORITHM SUITE ---');

// 1. Tamil Nadu
assertEqual(calculateDeliveryCharge('Tamil Nadu', 1), { state: 'Tamil Nadu', totalProducts: 1, deliveryCharge: 60, isFreeDelivery: false }, 'TN 1 prod = ₹60');
assertEqual(calculateDeliveryCharge('Tamil Nadu', 5), { state: 'Tamil Nadu', totalProducts: 5, deliveryCharge: 60, isFreeDelivery: false }, 'TN 5 prods = ₹60');
assertEqual(calculateDeliveryCharge('Tamil Nadu', 6), { state: 'Tamil Nadu', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'TN 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Tamil Nadu', 10), { state: 'Tamil Nadu', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'TN 10 prods = FREE');
assertEqual(calculateDeliveryCharge('Tamil Nadu', 20), { state: 'Tamil Nadu', totalProducts: 20, deliveryCharge: 0, isFreeDelivery: true }, 'TN 20 prods = FREE');

// 2. Puducherry
assertEqual(calculateDeliveryCharge('Puducherry', 1), { state: 'Puducherry', totalProducts: 1, deliveryCharge: 60, isFreeDelivery: false }, 'Puducherry 1 prod = ₹60');
assertEqual(calculateDeliveryCharge('Puducherry', 5), { state: 'Puducherry', totalProducts: 5, deliveryCharge: 60, isFreeDelivery: false }, 'Puducherry 5 prods = ₹60');
assertEqual(calculateDeliveryCharge('Puducherry', 6), { state: 'Puducherry', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'Puducherry 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Puducherry', 10), { state: 'Puducherry', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'Puducherry 10 prods = FREE');

// 3. Kerala
assertEqual(calculateDeliveryCharge('Kerala', 1), { state: 'Kerala', totalProducts: 1, deliveryCharge: 80, isFreeDelivery: false }, 'Kerala 1 prod = ₹80');
assertEqual(calculateDeliveryCharge('Kerala', 5), { state: 'Kerala', totalProducts: 5, deliveryCharge: 80, isFreeDelivery: false }, 'Kerala 5 prods = ₹80');
assertEqual(calculateDeliveryCharge('Kerala', 6), { state: 'Kerala', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'Kerala 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Kerala', 10), { state: 'Kerala', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'Kerala 10 prods = FREE');
assertEqual(calculateDeliveryCharge('Kerala', 11), { state: 'Kerala', totalProducts: 11, deliveryCharge: 110, isFreeDelivery: false }, 'Kerala 11 prods = 11 x ₹10 = ₹110');
assertEqual(calculateDeliveryCharge('Kerala', 12), { state: 'Kerala', totalProducts: 12, deliveryCharge: 120, isFreeDelivery: false }, 'Kerala 12 prods = 12 x ₹10 = ₹120');
assertEqual(calculateDeliveryCharge('Kerala', 20), { state: 'Kerala', totalProducts: 20, deliveryCharge: 200, isFreeDelivery: false }, 'Kerala 20 prods = 20 x ₹10 = ₹200');

// 4. Karnataka
assertEqual(calculateDeliveryCharge('Karnataka', 1), { state: 'Karnataka', totalProducts: 1, deliveryCharge: 80, isFreeDelivery: false }, 'Karnataka 1 prod = ₹80');
assertEqual(calculateDeliveryCharge('Karnataka', 5), { state: 'Karnataka', totalProducts: 5, deliveryCharge: 80, isFreeDelivery: false }, 'Karnataka 5 prods = ₹80');
assertEqual(calculateDeliveryCharge('Karnataka', 6), { state: 'Karnataka', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'Karnataka 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Karnataka', 10), { state: 'Karnataka', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'Karnataka 10 prods = FREE');
assertEqual(calculateDeliveryCharge('Karnataka', 11), { state: 'Karnataka', totalProducts: 11, deliveryCharge: 110, isFreeDelivery: false }, 'Karnataka 11 prods = ₹110');
assertEqual(calculateDeliveryCharge('Karnataka', 20), { state: 'Karnataka', totalProducts: 20, deliveryCharge: 200, isFreeDelivery: false }, 'Karnataka 20 prods = ₹200');

// 5. Andhra Pradesh
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 1), { state: 'Andhra Pradesh', totalProducts: 1, deliveryCharge: 80, isFreeDelivery: false }, 'Andhra Pradesh 1 prod = ₹80');
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 5), { state: 'Andhra Pradesh', totalProducts: 5, deliveryCharge: 80, isFreeDelivery: false }, 'Andhra Pradesh 5 prods = ₹80');
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 6), { state: 'Andhra Pradesh', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'Andhra Pradesh 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 10), { state: 'Andhra Pradesh', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'Andhra Pradesh 10 prods = FREE');
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 11), { state: 'Andhra Pradesh', totalProducts: 11, deliveryCharge: 110, isFreeDelivery: false }, 'Andhra Pradesh 11 prods = ₹110');
assertEqual(calculateDeliveryCharge('Andhra Pradesh', 20), { state: 'Andhra Pradesh', totalProducts: 20, deliveryCharge: 200, isFreeDelivery: false }, 'Andhra Pradesh 20 prods = ₹200');

// 6. Telangana
assertEqual(calculateDeliveryCharge('Telangana', 1), { state: 'Telangana', totalProducts: 1, deliveryCharge: 80, isFreeDelivery: false }, 'Telangana 1 prod = ₹80');
assertEqual(calculateDeliveryCharge('Telangana', 5), { state: 'Telangana', totalProducts: 5, deliveryCharge: 80, isFreeDelivery: false }, 'Telangana 5 prods = ₹80');
assertEqual(calculateDeliveryCharge('Telangana', 6), { state: 'Telangana', totalProducts: 6, deliveryCharge: 0, isFreeDelivery: true }, 'Telangana 6 prods = FREE');
assertEqual(calculateDeliveryCharge('Telangana', 10), { state: 'Telangana', totalProducts: 10, deliveryCharge: 0, isFreeDelivery: true }, 'Telangana 10 prods = FREE');
assertEqual(calculateDeliveryCharge('Telangana', 11), { state: 'Telangana', totalProducts: 11, deliveryCharge: 110, isFreeDelivery: false }, 'Telangana 11 prods = ₹110');
assertEqual(calculateDeliveryCharge('Telangana', 20), { state: 'Telangana', totalProducts: 20, deliveryCharge: 200, isFreeDelivery: false }, 'Telangana 20 prods = ₹200');

// 7. Other States
assertEqual(calculateDeliveryCharge('Other States', 1), { state: 'Other States', totalProducts: 1, deliveryCharge: 140, isFreeDelivery: false }, 'Other States 1 prod = ₹140');
assertEqual(calculateDeliveryCharge('Other States', 5), { state: 'Other States', totalProducts: 5, deliveryCharge: 140, isFreeDelivery: false }, 'Other States 5 prods = ₹140');
assertEqual(calculateDeliveryCharge('Other States', 10), { state: 'Other States', totalProducts: 10, deliveryCharge: 140, isFreeDelivery: false }, 'Other States 10 prods = ₹140');
assertEqual(calculateDeliveryCharge('Other States', 11), { state: 'Other States', totalProducts: 11, deliveryCharge: 110, isFreeDelivery: false }, 'Other States 11 prods = 11 x ₹10 = ₹110');
assertEqual(calculateDeliveryCharge('Other States', 12), { state: 'Other States', totalProducts: 12, deliveryCharge: 120, isFreeDelivery: false }, 'Other States 12 prods = 12 x ₹10 = ₹120');
assertEqual(calculateDeliveryCharge('Other States', 20), { state: 'Other States', totalProducts: 20, deliveryCharge: 200, isFreeDelivery: false }, 'Other States 20 prods = 20 x ₹10 = ₹200');

// 8. Multi-Item Cart Verification (A x 2, B x 3, C x 4 => sum = 9)
const multiCartQty = 2 + 3 + 4;
assertEqual(calculateDeliveryCharge('Kerala', multiCartQty), { state: 'Kerala', totalProducts: 9, deliveryCharge: 0, isFreeDelivery: true }, 'Multi-item Cart (sum=9) Kerala = FREE');
assertEqual(calculateDeliveryCharge('Other States', multiCartQty), { state: 'Other States', totalProducts: 9, deliveryCharge: 140, isFreeDelivery: false }, 'Multi-item Cart (sum=9) Other States = ₹140');

console.log('--- ALL AUTOMATED DELIVERY CHARGE SUITE TESTS PASSED 100% ---');
