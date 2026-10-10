const fs = require('fs');
const path = require('path');

// Update local.properties
const localPropPath = 'C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\android\\local.properties';
const localPropContent = 'sdk.dir=C:/cinmax-build/android-sdk\ncmake.dir=C:/cinmax-build/android-sdk/cmake/3.22.1\n';
fs.writeFileSync(localPropPath, localPropContent, 'utf8');
console.log('Updated local.properties');

// Recursively find and delete all .cxx folders in node_modules and apps/mobile/android
function removeAllCxx(dir) {
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
          } catch (err) {
            console.error('Error removing ' + full, err);
          }
        } else if (e.name !== '.git') {
          removeAllCxx(full);
        }
      }
    }
  } catch (err) {}
}

removeAllCxx('C:\\cinmax-build\\Cinmax-Dev\\node_modules');
removeAllCxx('C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\android');

console.log('Finished cleaning all .cxx folders.');
