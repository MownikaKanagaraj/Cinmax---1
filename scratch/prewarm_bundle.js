const http = require('http');

console.log('Pre-warming Metro JavaScript bundle...');

const start = Date.now();
const req = http.get('http://localhost:8081/apps/mobile/node_modules/expo-router/entry.bundle?platform=android&dev=true', (res) => {
  console.log('STATUS:', res.statusCode);
  let size = 0;
  res.on('data', chunk => size += chunk.length);
  res.on('end', () => {
    console.log(`Pre-warming complete! Bundle size: ${(size / 1024 / 1024).toFixed(2)} MB in ${Date.now() - start} ms`);
  });
});

req.on('error', e => console.error('Error prewarming:', e.message));
