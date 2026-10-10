const fs = require('fs');
const path = require('path');

// 1. Fix expo-modules-core
const expoCoreDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\expo-modules-core@57.0._n6ahvxya4tgsdqwz4mnlbyizpm\\node_modules\\expo-modules-core';
const commonCppSrc = path.join(expoCoreDir, 'common\\cpp');
const commonCppDst = path.join(expoCoreDir, 'android\\src\\common\\cpp');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const e of entries) {
    const s = path.join(src, e.name);
    const d = path.join(dest, e.name);
    if (e.isDirectory()) copyDirRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

if (fs.existsSync(commonCppSrc)) {
  copyDirRecursive(commonCppSrc, commonCppDst);
  console.log('Copied expo-modules-core common/cpp');
}

const varsPath = path.join(expoCoreDir, 'android\\cmake\\variables.cmake');
if (fs.existsSync(varsPath)) {
  let vars = fs.readFileSync(varsPath, 'utf8');
  vars = vars.replace('set(ANDROID_SRC_DIR ${CMAKE_SOURCE_DIR}/src)', 'set(ANDROID_SRC_DIR "src")');
  vars = vars.replace('set(COMMON_DIR ${CMAKE_SOURCE_DIR}/../common/cpp)', 'set(COMMON_DIR "src/common/cpp")');
  fs.writeFileSync(varsPath, vars, 'utf8');
  console.log('Updated expo-modules-core variables.cmake to relative paths');
}

// 2. Check and fix react-native-reanimated
const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const reanimatedCommon = path.join(reanimatedDir, 'Common\\cpp');
const reanimatedDst = path.join(reanimatedDir, 'android\\src\\main\\cpp\\Common');

if (fs.existsSync(reanimatedCommon)) {
  copyDirRecursive(reanimatedCommon, reanimatedDst);
  console.log('Copied react-native-reanimated Common/cpp');
}

const reanimatedCMake = path.join(reanimatedDir, 'android\\CMakeLists.txt');
if (fs.existsSync(reanimatedCMake)) {
  let cmake = fs.readFileSync(reanimatedCMake, 'utf8');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR "\${CMAKE_SOURCE_DIR}\/\.\.\/Common\/cpp"\)/g, 'set(COMMON_CPP_DIR "src/main/cpp/Common")');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR "\.\.\/Common\/cpp"\)/g, 'set(COMMON_CPP_DIR "src/main/cpp/Common")');
  fs.writeFileSync(reanimatedCMake, cmake, 'utf8');
  console.log('Updated reanimated CMakeLists.txt to relative paths');
}
