const fs = require('fs');
const path = require('path');

function findZodDirs(startDir) {
  const results = [];
  function traverse(dir) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch { return; }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'zod' && fs.existsSync(path.join(fullPath, 'package.json'))) {
          results.push(fullPath);
        } else if (entry.name !== '.git' && entry.name !== '.next') {
          traverse(fullPath);
        }
      }
    }
  }
  traverse(startDir);
  return results;
}

const rootNodeModules = path.resolve(__dirname, '../node_modules');
const zodDirs = findZodDirs(rootNodeModules);

for (const zd of zodDirs) {
  const v3Helpers = path.join(zd, 'v3', 'helpers');
  if (!fs.existsSync(v3Helpers)) {
    fs.mkdirSync(v3Helpers, { recursive: true });
  }
  fs.writeFileSync(path.join(v3Helpers, 'typeAliases.js'), 'export {};\n', 'utf8');
  fs.writeFileSync(path.join(v3Helpers, 'typeAliases.cjs'), '"use strict";\nmodule.exports = {};\n', 'utf8');

  const libHelpers = path.join(zd, 'lib', 'helpers');
  if (!fs.existsSync(libHelpers)) {
    fs.mkdirSync(libHelpers, { recursive: true });
  }
  fs.writeFileSync(path.join(libHelpers, 'typeAliases.js'), 'export {};\n', 'utf8');
  fs.writeFileSync(path.join(libHelpers, 'typeAliases.cjs'), '"use strict";\nmodule.exports = {};\n', 'utf8');
  console.log('Patched zod in:', zd);
}
