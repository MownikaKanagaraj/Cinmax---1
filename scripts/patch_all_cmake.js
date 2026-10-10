const fs = require('fs');
const path = require('path');

function patchAllCMake(dir) {
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        if (e.name !== '.git') {
          patchAllCMake(full);
        }
      } else if (e.name.toLowerCase() === 'cmakelists.txt') {
        try {
          let content = fs.readFileSync(full, 'utf8');
          let modified = false;
          
          if (!content.includes('CMAKE_SUPPRESS_REGENERATION')) {
            content = 'set(CMAKE_SUPPRESS_REGENERATION ON)\nset(CMAKE_OBJECT_PATH_MAX 1024)\n' + content;
            modified = true;
          }
          
          if (content.includes('CONFIGURE_DEPENDS')) {
            content = content.replace(/CONFIGURE_DEPENDS/g, '');
            modified = true;
          }
          
          if (modified) {
            fs.writeFileSync(full, content, 'utf8');
            console.log('Patched CMakeLists.txt with CMAKE_SUPPRESS_REGENERATION:', full);
          }
        } catch (err) {
          console.error('Error patching ' + full, err);
        }
      }
    }
  } catch (err) {}
}

patchAllCMake('C:\\cinmax-build\\Cinmax-Dev\\node_modules');
patchAllCMake('C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\android');
console.log('Finished patching all CMakeLists.txt files with CMAKE_SUPPRESS_REGENERATION.');
