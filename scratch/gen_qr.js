const QRCode = require('qrcode');
const path = require('path');

const targetDir = 'C:\\Users\\Mownika Kanagaraj\\.gemini\\antigravity-ide\\brain\\03ad2543-620d-4300-9970-570eb2b137b9';

async function generate() {
  await QRCode.toFile(path.join(targetDir, 'expo_qr_code.png'), 'exp://bed17ecd231afc75-103-115-236-19.serveousercontent.com', {
    width: 400,
    margin: 2,
    color: { dark: '#002754', light: '#FFFFFF' }
  });
  console.log('Final Verified Expo SDK 57 exp:// QR generated');

  await QRCode.toFile(path.join(targetDir, 'expo_lan_qr.png'), 'exp://192.168.66.1:8081', {
    width: 400,
    margin: 2,
    color: { dark: '#002754', light: '#FFFFFF' }
  });
  console.log('LAN QR generated');
}

generate();
