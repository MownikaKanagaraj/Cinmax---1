const fs = require('fs');
const path = require('path');

const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const oldCommon = path.join(reanimatedDir, 'android\\src\\main\\cpp\\Common');
const newCommon = path.join(reanimatedDir, 'android\\src\\main\\cpp\\c');

// 1. Rename Common to c
if (fs.existsSync(oldCommon)) {
  if (fs.existsSync(newCommon)) {
    fs.rmSync('\\\\?\\' + newCommon, { recursive: true, force: true });
  }
  fs.renameSync(oldCommon, newCommon);
  console.log('Renamed Common to c in reanimated');
}

// 2. Update reanimated CMakeLists.txt
const reanimatedCMake = path.join(reanimatedDir, 'android\\CMakeLists.txt');
if (fs.existsSync(reanimatedCMake)) {
  let cmake = fs.readFileSync(reanimatedCMake, 'utf8');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR "[^"]*"\)/g, 'set(COMMON_CPP_DIR "src/main/cpp/c")');
  fs.writeFileSync(reanimatedCMake, cmake, 'utf8');
  console.log('Updated reanimated CMakeLists.txt to set(COMMON_CPP_DIR "src/main/cpp/c")');
}

// 3. Pre-create all subdirectories inside CMakeFiles for reanimated
function precreateDirs(baseDir, sourceDir) {
  function walk(current) {
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const sub = path.join(current, e.name);
        const rel = path.relative(sourceDir, sub);
        const targetDir = path.join(baseDir, rel);
        const longPath = '\\\\?\\' + targetDir;
        if (!fs.existsSync(longPath)) {
          fs.mkdirSync(longPath, { recursive: true });
          console.log('Pre-created:', targetDir);
        }
        walk(sub);
      }
    }
  }
  if (fs.existsSync(sourceDir)) {
    walk(sourceDir);
  }
}

// Pre-create for all ABIs in reanimated and expo-modules-core
const abis = ['arm64-v8a', 'armeabi-v7a', 'x86', 'x86_64'];
const cxxDirs = [
  'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated\\android\\.cxx\\RelWithDebInfo\\4jbw1r4l',
  'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\expo-modules-core@57.0._n6ahvxya4tgsdqwz4mnlbyizpm\\node_modules\\expo-modules-core\\android\\.cxx\\RelWithDebInfo\\y27276n5'
];

for (const cxx of cxxDirs) {
  for (const abi of abis) {
    const cmakeFiles = path.join(cxx, abi, 'CMakeFiles');
    if (fs.existsSync(cmakeFiles)) {
      const srcCpp = path.join(reanimatedDir, 'android\\src\\main\\cpp');
      precreateDirs(path.join(cmakeFiles, 'reanimated.dir\\src\\main\\cpp'), srcCpp);
    }
  }
}
