const https = require('https');

const domain = 'bed17ecd231afc75-103-115-236-19.serveousercontent.com';

const options = {
  hostname: domain,
  path: '/',
  method: 'GET',
  headers: {
    'accept': 'application/json',
    'expo-platform': 'android',
    'expo-api-version': '2',
    'user-agent': 'ExpoGo/2.30.0'
  }
};

console.log('Testing Manifest fetch over Serveo tunnel for domain:', domain);

const req = https.request(options, (res) => {
  console.log('MANIFEST STATUS:', res.statusCode);
  console.log('MANIFEST HEADERS:', JSON.stringify(res.headers, null, 2));

  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('MANIFEST BODY SNIPPET:\n', body.slice(0, 400));
  });
});

req.on('error', (e) => {
  console.error('HTTPS ERROR:', e.message);
});

req.end();
