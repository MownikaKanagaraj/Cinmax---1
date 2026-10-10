import http from 'http';
import fs from 'fs';
import path from 'path';

const PORT = 8099;
const apkPath = 'c:\\Users\\Mownika Kanagaraj\\OneDrive\\Desktop\\Cinmax-Dev\\CINMAX-app-release.apk';

const server = http.createServer((req, res) => {
  if (req.url === '/CINMAX-app-release.apk' || req.url === '/download' || req.url === '/') {
    if (!fs.existsSync(apkPath)) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('APK not found');
    }

    const stat = fs.statSync(apkPath);
    res.writeHead(200, {
      'Content-Type': 'application/vnd.android.package-archive',
      'Content-Length': stat.size,
      'Content-Disposition': 'attachment; filename="CINMAX-app-release.apk"',
      'Access-Control-Allow-Origin': '*',
    });

    const readStream = fs.createReadStream(apkPath);
    readStream.pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`APK Download Server running on port ${PORT}`);
});
