const http = require('http');

const options = {
  hostname: 'localhost',
  port: 8081,
  path: '/',
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'expo-platform': 'android',
    'expo-api-version': '2',
    'user-agent': 'ExpoGo/2.30.0'
  }
};

const req = http.request(options, (res) => {
  console.log('STATUS:', res.statusCode);
  console.log('HEADERS:', JSON.stringify(res.headers, null, 2));

  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('BODY snippet:', body.slice(0, 500));
  });
});

req.on('error', (e) => {
  console.error('ERROR:', e.message);
});

req.end();
