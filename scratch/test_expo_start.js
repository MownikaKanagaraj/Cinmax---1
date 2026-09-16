const { spawn } = require('child_process');
const path = require('path');

const mobileDir = path.join(__dirname, '../apps/mobile');
const serveoHost = 'bed17ecd231afc75-103-115-236-19.serveousercontent.com';

console.log('Starting Clean Expo SDK 57 Server for host:', serveoHost);

const child = spawn('npx.cmd', ['expo', 'start', '-c', '--port', '8081'], {
  cwd: mobileDir,
  env: { 
    ...process.env, 
    CI: '1', 
    FORCE_COLOR: '0',
    REACT_NATIVE_PACKAGER_HOSTNAME: serveoHost
  },
  shell: true
});

child.stdout.on('data', (data) => {
  console.log('[STDOUT]:', data.toString());
});

child.stderr.on('data', (data) => {
  console.error('[STDERR]:', data.toString());
});

child.on('close', (code) => {
  console.log('Expo exited with code:', code);
});
