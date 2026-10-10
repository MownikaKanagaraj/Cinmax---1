const fs = require('fs');
const path = require('path');

const pkgs = ['react-is', 'react-freeze'];
const mobileNm = path.resolve(__dirname, '../apps/mobile/node_modules');

for (const pkg of pkgs) {
  const target = path.join(mobileNm, pkg);
  if (fs.existsSync(target)) {
    const real = fs.realpathSync(target);
    if (real !== target) {
      console.log(`Replacing symlink ${target} with real copy from ${real}`);
      fs.unlinkSync(target);
      fs.cpSync(real, target, { recursive: true });
    }
  }
}
console.log('Finished fixing local symlinks for Metro');
