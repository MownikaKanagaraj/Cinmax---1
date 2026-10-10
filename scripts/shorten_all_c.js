const fs = require('fs');
const path = require('path');

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

// 1. Fix react-native-reanimated
const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const reanimatedCommon = path.join(reanimatedDir, 'Common\\cpp');
const reanimatedC = path.join(reanimatedDir, 'android\\c');
const reanimatedNVCommon = path.join(reanimatedDir, 'Common\\NativeView');
const reanimatedNV = path.join(reanimatedDir, 'android\\nv');

if (fs.existsSync(reanimatedC)) fs.rmSync('\\\\?\\' + reanimatedC, { recursive: true, force: true });
copyDir(reanimatedCommon, reanimatedC);
console.log('Copied reanimated Common/cpp to android/c');

if (fs.existsSync(reanimatedNVCommon)) {
  if (fs.existsSync(reanimatedNV)) fs.rmSync('\\\\?\\' + reanimatedNV, { recursive: true, force: true });
  copyDir(reanimatedNVCommon, reanimatedNV);
  console.log('Copied reanimated Common/NativeView to android/nv');
}

const reanimatedCMake = path.join(reanimatedDir, 'android\\CMakeLists.txt');
if (fs.existsSync(reanimatedCMake)) {
  let cmake = fs.readFileSync(reanimatedCMake, 'utf8');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR [^)]*\)/g, 'set(COMMON_CPP_DIR "c")');
  cmake = cmake.replace(/set\(ANDROID_CPP_DIR [^)]*\)/g, 'set(ANDROID_CPP_DIR "src/main/cpp")');
  cmake = cmake.replace(/set\(NATIVEVIEW_DIR [^)]*\)/g, 'set(NATIVEVIEW_DIR "nv")');
  cmake = cmake.replace(/set\(PACKAGE_ROOT_DIR [^)]*\)/g, 'set(PACKAGE_ROOT_DIR "..")');
  if (!cmake.includes('"${NATIVEVIEW_DIR}"')) {
    cmake = cmake.replace('PRIVATE "${COMMON_CPP_DIR}"', 'PRIVATE "${COMMON_CPP_DIR}"\n          "${NATIVEVIEW_DIR}"');
  }
  fs.writeFileSync(reanimatedCMake, cmake, 'utf8');
  console.log('Updated reanimated CMakeLists.txt to relative short paths and include nv');
}

// 2. Fix react-native-worklets
const workletsDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets';
const workletsCommon = path.join(workletsDir, 'Common\\cpp');
const workletsC = path.join(workletsDir, 'android\\c');

if (fs.existsSync(workletsC)) fs.rmSync('\\\\?\\' + workletsC, { recursive: true, force: true });
copyDir(workletsCommon, workletsC);
console.log('Copied worklets Common/cpp to android/c');

const workletsCMake = path.join(workletsDir, 'android\\CMakeLists.txt');
if (fs.existsSync(workletsCMake)) {
  let cmake = fs.readFileSync(workletsCMake, 'utf8');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR [^)]*\)/g, 'set(COMMON_CPP_DIR "c")');
  cmake = cmake.replace(/set\(ANDROID_CPP_DIR [^)]*\)/g, 'set(ANDROID_CPP_DIR "src/main/cpp")');
  fs.writeFileSync(workletsCMake, cmake, 'utf8');
  console.log('Updated worklets CMakeLists.txt to relative short paths');
}

// 3. Fix expo-modules-core
const expoCoreDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\expo-modules-core@57.0._n6ahvxya4tgsdqwz4mnlbyizpm\\node_modules\\expo-modules-core';
const expoCommon = path.join(expoCoreDir, 'common\\cpp');
const expoC = path.join(expoCoreDir, 'android\\c');

if (fs.existsSync(expoC)) fs.rmSync('\\\\?\\' + expoC, { recursive: true, force: true });
copyDir(expoCommon, expoC);
console.log('Copied expo-modules-core common/cpp to android/c');

const expoVars = path.join(expoCoreDir, 'android\\cmake\\variables.cmake');
if (fs.existsSync(expoVars)) {
  let vars = fs.readFileSync(expoVars, 'utf8');
  vars = vars.replace(/set\(COMMON_DIR [^)]*\)/g, 'set(COMMON_DIR "c")');
  vars = vars.replace(/set\(ANDROID_SRC_DIR [^)]*\)/g, 'set(ANDROID_SRC_DIR "src")');
  fs.writeFileSync(expoVars, vars, 'utf8');
  console.log('Updated expo-modules-core variables.cmake to set(COMMON_DIR "c")');
}
