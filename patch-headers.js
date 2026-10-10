const fs = require('fs');
const path = require('path');

function walk(dir) {
  try {
    for (const f of fs.readdirSync(dir)) {
      const p = path.join(dir, f);
      const s = fs.statSync(p);
      if (s.isDirectory()) {
        walk(p);
      } else if (f === 'graphicsConversions.h') {
        let content = fs.readFileSync(p, 'utf8');
        if (content.includes('std::format')) {
          content = content.replace(/std::format\("\{\}%", dimension\.value\)/g, '(std::to_string(dimension.value) + "%")');
          fs.writeFileSync(p, content, 'utf8');
          console.log('Successfully patched:', p);
        }
      }
    }
  } catch (e) {
    // ignore permission/access errors
  }
}

console.log('Searching C:/g/caches for graphicsConversions.h...');
walk('C:\\g\\caches');
console.log('Done patching.');
