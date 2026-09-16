const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const mobileDir = path.join(__dirname, '../apps/mobile');

console.log('Starting Expo Official Tunnel in:', mobileDir);

const child = spawn('npx.cmd', ['expo', 'start', '--tunnel', '--port', '8081'], {
  cwd: mobileDir,
  env: { 
    ...process.env, 
    CI: '1', 
    FORCE_COLOR: '0'
  },
  shell: true
});

child.stdout.on('data', (data) => {
  const str = data.toString();
  console.log('[EXPO STDOUT]:', str);
});

child.stderr.on('data', (data) => {
  console.error('[EXPO STDERR]:', data.toString());
});

child.on('close', (code) => {
  console.log('Expo tunnel exited with code:', code);
});
