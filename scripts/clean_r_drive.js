const fs = require('fs');
const path = require('path');

// Clean .cxx in R:
function cleanCxx(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name === '.cxx') {
          const longPath = '\\\\?\\' + full;
          try {
            fs.rmSync(longPath, { recursive: true, force: true });
            console.log('Removed: ' + full);
          } catch (err) {}
        } else if (e.name !== '.git') {
          cleanCxx(full);
        }
      }
    }
  } catch (err) {}
}

cleanCxx('R:\\node_modules');
cleanCxx('R:\\apps\\mobile\\android');

const localPropContent = 'sdk.dir=C:/cinmax-build/android-sdk\ncmake.dir=C:/cinmax-build/android-sdk/cmake/3.22.1\n';
fs.writeFileSync('R:\\local.properties', localPropContent, 'utf8');
fs.writeFileSync('R:\\apps\\mobile\\android\\local.properties', localPropContent, 'utf8');

console.log('Cleaned .cxx and updated local.properties in R:');
