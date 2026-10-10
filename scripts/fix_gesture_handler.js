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

const rnghDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-gesture-ha_jejxgn5vscmxztm4ruwubjmbxq\\node_modules\\react-native-gesture-handler';
const runtimeSrc = path.join(rnghDir, 'shared\\runtime');
const shadowNodesSrc = path.join(rnghDir, 'shared\\shadowNodes');

const jniRtDest = path.join(rnghDir, 'android\\src\\main\\jni\\rt');
const androidSnDest = path.join(rnghDir, 'android\\sn');

// Clean any old folders
const oldJniShared = path.join(rnghDir, 'android\\src\\main\\jni\\shared');
const oldAndroidShared = path.join(rnghDir, 'android\\shared');
if (fs.existsSync(oldJniShared)) fs.rmSync('\\\\?\\' + oldJniShared, { recursive: true, force: true });
if (fs.existsSync(oldAndroidShared)) fs.rmSync('\\\\?\\' + oldAndroidShared, { recursive: true, force: true });

if (fs.existsSync(jniRtDest)) fs.rmSync('\\\\?\\' + jniRtDest, { recursive: true, force: true });
if (fs.existsSync(androidSnDest)) fs.rmSync('\\\\?\\' + androidSnDest, { recursive: true, force: true });

// Copy runtime into jni/rt and shadowNodes into android/sn
copyDir(runtimeSrc, jniRtDest);
console.log('Copied RNGH runtime to android/src/main/jni/rt');

copyDir(shadowNodesSrc, androidSnDest);
console.log('Copied RNGH shadowNodes to android/sn');

// 1. Update android/src/main/jni/CMakeLists.txt
const jniCMake = path.join(rnghDir, 'android\\src\\main\\jni\\CMakeLists.txt');
if (fs.existsSync(jniCMake)) {
  let cmake = fs.readFileSync(jniCMake, 'utf8');
  cmake = cmake.replace(/set\(RNGH_DIR [^)]*\)/g, 'set(RNGH_DIR "${CMAKE_SOURCE_DIR}/rt")');
  cmake = cmake.replace(/file\(GLOB_RECURSE gesture_handler_SRCS[\s\S]*?\)/,
    'file(GLOB gesture_handler_SRCS ./*.cpp)');
  cmake = cmake.replace(/file\(GLOB_RECURSE gesture_handler_shared_SRCS[\s\S]*?\)/,
    'file(GLOB gesture_handler_shared_SRCS ./rt/*.cpp)');
  cmake = cmake.replace('"${RNGH_DIR}/shared/runtime"', '"${CMAKE_SOURCE_DIR}/rt"');
  cmake = cmake.replace('"shared/runtime"', '"${CMAKE_SOURCE_DIR}/rt"');
  fs.writeFileSync(jniCMake, cmake, 'utf8');
  console.log('Updated RNGH jni/CMakeLists.txt');
}

// 2. Update android/CMakeLists.txt
const rootCMake = path.join(rnghDir, 'android\\CMakeLists.txt');
if (fs.existsSync(rootCMake)) {
  let cmake = fs.readFileSync(rootCMake, 'utf8');
  cmake = cmake.replace(/file\(GLOB_RECURSE rn_gesture_handler_SRCS[\s\S]*?\)/,
    'file(GLOB_RECURSE rn_gesture_handler_SRCS ./sn/*.cpp)');
  cmake = cmake.replace('target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC ../shared/shadowNodes)',
    'target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC ./sn)');
  cmake = cmake.replace('target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC shared/shadowNodes)',
    'target_include_directories(react_codegen_rngesturehandler_codegen PUBLIC ./sn)');
  fs.writeFileSync(rootCMake, cmake, 'utf8');
  console.log('Updated RNGH android/CMakeLists.txt');
}
