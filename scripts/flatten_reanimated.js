const fs = require('fs');
const path = require('path');

const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const cDir = path.join(reanimatedDir, 'android\\src\\main\\cpp\\c');
const cReanimated = path.join(cDir, 'reanimated');

// If c/reanimated exists, move its contents up into c/ and create a reanimated symlink/copy for header includes
if (fs.existsSync(cReanimated)) {
  const entries = fs.readdirSync(cReanimated);
  for (const e of entries) {
    const src = path.join(cReanimated, e);
    const dst = path.join(cDir, e);
    if (!fs.existsSync(dst)) {
      fs.renameSync(src, dst);
    }
  }
  console.log('Moved c/reanimated/* up to c/');
}

// Update reanimated CMakeLists.txt
const cmakePath = path.join(reanimatedDir, 'android\\CMakeLists.txt');
if (fs.existsSync(cmakePath)) {
  let cmake = fs.readFileSync(cmakePath, 'utf8');
  cmake = cmake.replace('set(COMMON_CPP_DIR "src/main/cpp/c")', 'set(COMMON_CPP_DIR "src/main/cpp/c")');
  cmake = cmake.replace('"${COMMON_CPP_DIR}/reanimated/*.cpp"', '"${COMMON_CPP_DIR}/*.cpp"');
  // Include both c and c/.. for include paths
  fs.writeFileSync(cmakePath, cmake, 'utf8');
  console.log('Updated reanimated CMakeLists.txt with flattened sources');
}

// Pre-create all subdirectories across all ABIs
function precreateAll(targetBase, sourceDir) {
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
const cxxDirs = [
  'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated\\android\\.cxx\\RelWithDebInfo\\4jbw1r4l'
];

for (const cxx of cxxDirs) {
  for (const abi of abis) {
    const cmakeFiles = path.join(cxx, abi, 'CMakeFiles');
    const targetBase = path.join(cmakeFiles, 'reanimated.dir\\src\\main\\cpp\\c');
    precreateAll(targetBase, cDir);
  }
}
console.log('Pre-created all directories for reanimated.');
