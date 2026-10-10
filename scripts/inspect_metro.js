const fs = require('fs');

const p = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\metro@0.84.5\\node_modules\\metro\\src\\Bundler.js';
if (fs.existsSync(p)) {
  const lines = fs.readFileSync(p, 'utf8').split('\n');
  console.log(lines.slice(0, 45).join('\n'));
}
