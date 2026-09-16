const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

function checkUrl(url) {
  return new Promise((resolve) => {
    try {
      const client = url.startsWith('https') ? https : http;
      const req = client.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
        resolve({ url, status: res.statusCode });
      });
      req.on('error', (err) => resolve({ url, status: 'ERROR: ' + err.message }));
      req.on('timeout', () => { req.destroy(); resolve({ url, status: 'TIMEOUT' }); });
      req.end();
    } catch (e) {
      resolve({ url, status: 'EXCEPTION: ' + e.message });
    }
  });
}

async function findUrlsInFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, 'utf8');
  const urlRegex = /(https:\/\/[^\s"'\)]+)/g;
  const matches = content.match(urlRegex) || [];
  return [...new Set(matches)];
}

async function scan() {
  const filesToScan = [
    'apps/website/src/app/page.tsx',
    'apps/website/src/components/hero-carousel.tsx',
    'apps/website/src/components/category-card.tsx',
    'apps/website/src/components/product-card.tsx',
    'apps/website/src/components/cart-drawer.tsx',
    'apps/website/src/app/product/[slug]/page.tsx',
    'packages/api/src/modules/marketing/mock.repository.ts',
  ];

  let allUrls = [];
  for (const f of filesToScan) {
    const fullPath = path.join(process.cwd(), f);
    const urls = await findUrlsInFile(fullPath);
    console.log(`Found ${urls.length} URLs in ${f}`);
    allUrls.push(...urls.map(u => ({ file: f, url: u })));
  }

  const results = [];
  for (const item of allUrls) {
    const res = await checkUrl(item.url);
    results.push({ file: item.file, url: item.url, status: res.status });
    console.log(`[${res.status}] ${item.url} (${item.file})`);
  }

  console.log('\n--- BROKEN BROSER URLS (STATUS 404 or ERROR) ---');
  const broken = results.filter(r => r.status === 404 || typeof r.status === 'string');
  console.log(JSON.stringify(broken, null, 2));
}

scan();
