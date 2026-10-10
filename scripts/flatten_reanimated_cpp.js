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

const reanimatedDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-reanimated_fc6m5nikzm7t5fr7d2ylrqct2y\\node_modules\\react-native-reanimated';
const reanimatedCommon = path.join(reanimatedDir, 'Common\\cpp');
const reanimatedC = path.join(reanimatedDir, 'android\\c');
const reanimatedCppFlat = path.join(reanimatedC, 'cpp');
const reanimatedNVCommon = path.join(reanimatedDir, 'Common\\NativeView');
const reanimatedNV = path.join(reanimatedDir, 'android\\nv');

// Clean android/c and android/nv
if (fs.existsSync(reanimatedC)) {
  fs.rmSync('\\\\?\\' + reanimatedC, { recursive: true, force: true });
}
if (fs.existsSync(reanimatedNV)) {
  fs.rmSync('\\\\?\\' + reanimatedNV, { recursive: true, force: true });
}
fs.mkdirSync(reanimatedCppFlat, { recursive: true });
fs.mkdirSync(reanimatedNV, { recursive: true });

// Copy all headers preserving structure, and flatten all .cpp files into android/c/cpp/
function copyHeadersAndFlattenCpp(srcDir, baseDir) {
  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const e of entries) {
    const fullPath = path.join(srcDir, e.name);
    const relPath = path.relative(baseDir, fullPath);
    if (e.isDirectory()) {
      copyHeadersAndFlattenCpp(fullPath, baseDir);
    } else if (e.name.endsWith('.cpp')) {
      const flatName = relPath.replace(/[\\\/]/g, '_');
      const destCpp = path.join(reanimatedCppFlat, flatName);
      fs.copyFileSync(fullPath, destCpp);
    } else {
      const destHeader = path.join(reanimatedC, relPath);
      const destDir = path.dirname(destHeader);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      fs.copyFileSync(fullPath, destHeader);
    }
  }
}

copyHeadersAndFlattenCpp(reanimatedCommon, reanimatedCommon);
console.log('Flattened Reanimated Common .cpp files into android/c/cpp/ and preserved headers');

// Copy NativeView preserving its original structure into android/nv
copyDir(reanimatedNVCommon, reanimatedNV);
console.log('Copied NativeView to android/nv');

// Update CMakeLists.txt
const reanimatedCMake = path.join(reanimatedDir, 'android\\CMakeLists.txt');
if (fs.existsSync(reanimatedCMake)) {
  let cmake = fs.readFileSync(reanimatedCMake, 'utf8');
  cmake = cmake.replace(/set\(COMMON_CPP_DIR [^)]*\)/g, 'set(COMMON_CPP_DIR "c")');
  cmake = cmake.replace(/set\(ANDROID_CPP_DIR [^)]*\)/g, 'set(ANDROID_CPP_DIR "src/main/cpp")');
  cmake = cmake.replace(/set\(NATIVEVIEW_DIR [^)]*\)/g, 'set(NATIVEVIEW_DIR "nv")');
  cmake = cmake.replace(/set\(PACKAGE_ROOT_DIR [^)]*\)/g, 'set(PACKAGE_ROOT_DIR "..")');
  
  cmake = cmake.replace(/file\(GLOB_RECURSE REANIMATED_COMMON_CPP_SOURCES[\s\S]*?\)/,
    'file(GLOB_RECURSE REANIMATED_COMMON_CPP_SOURCES "${COMMON_CPP_DIR}/cpp/*.cpp")');
  cmake = cmake.replace(/file\(GLOB_RECURSE REANIMATED_ANDROID_CPP_SOURCES[\s\S]*?\)/,
    'file(GLOB_RECURSE REANIMATED_ANDROID_CPP_SOURCES "${ANDROID_CPP_DIR}/reanimated/*.cpp")');
  cmake = cmake.replace(/file\(GLOB_RECURSE REANIMATED_NATIVEVIEW_CPP_SOURCES[\s\S]*?\)/,
    'file(GLOB_RECURSE REANIMATED_NATIVEVIEW_CPP_SOURCES "${NATIVEVIEW_DIR}/react/renderer/components/rnreanimated/*.cpp")');

  if (!cmake.includes('"${NATIVEVIEW_DIR}"')) {
    cmake = cmake.replace('PRIVATE "${COMMON_CPP_DIR}"', 'PRIVATE "${COMMON_CPP_DIR}"\n          "${NATIVEVIEW_DIR}"\n          "${NATIVEVIEW_DIR}/react/renderer/components/rnreanimated"');
  }
  fs.writeFileSync(reanimatedCMake, cmake, 'utf8');
  console.log('Updated reanimated CMakeLists.txt to compile from flattened cpp folder & local nv');
}
