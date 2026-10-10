const fs = require('fs');
const path = require('path');

const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const originalCommon = path.join(reanimatedDir, 'Common\\cpp');
const cDir = path.join(reanimatedDir, 'android\\src\\main\\cpp\\c');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

// Clean and recreate c/
if (fs.existsSync(cDir)) {
  fs.rmSync('\\\\?\\' + cDir, { recursive: true, force: true });
}
fs.mkdirSync(cDir, { recursive: true });

// Copy Common/cpp into c/
copyDir(originalCommon, cDir);
console.log('Restored original Common/cpp structure into c/');

// Update reanimated CMakeLists.txt
const cmakePath = path.join(reanimatedDir, 'android\\CMakeLists.txt');
let cmake = fs.readFileSync(cmakePath, 'utf8');
cmake = cmake.replace(/set\(COMMON_CPP_DIR "[^"]*"\)/g, 'set(COMMON_CPP_DIR "src/main/cpp/c")');
cmake = cmake.replace('"${COMMON_CPP_DIR}/*.cpp"', '"${COMMON_CPP_DIR}/reanimated/*.cpp"');
fs.writeFileSync(cmakePath, cmake, 'utf8');
console.log('Updated reanimated CMakeLists.txt to use c/reanimated');

// Pre-create all CMakeFiles subdirectories with \\?\ for all 4 ABIs
function precreateSubdirs(targetBase, sourceDir) {
  function walk(curr) {
    const entries = fs.readdirSync(curr, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const sub = path.join(curr, e.name);
        const rel = path.relative(sourceDir, sub);
        const t = path.join(targetBase, rel);
        const longT = '\\\\?\\' + t;
        if (!fs.existsSync(longT)) {
          fs.mkdirSync(longT, { recursive: true });
        }
        walk(sub);
      }
    }
  }
  if (fs.existsSync(sourceDir)) walk(sourceDir);
}

const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
const baseCxx = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated\\android\\.cxx\\RelWithDebInfo\\4jbw1r4l';

for (const abi of abis) {
  const targetDir = path.join(baseCxx, abi, 'CMakeFiles\\reanimated.dir\\src\\main\\cpp\\c');
  precreateSubdirs(targetDir, cDir);
  console.log('Pre-created directories for ABI:', abi);
}
