const fs = require('fs');

const p = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\CMakeLists.txt';
if (fs.existsSync(p)) {
  let content = fs.readFileSync(p, 'utf8');
  content = content.replace(/file\(GLOB_RECURSE WORKLETS_COMMON_CPP_SOURCES CONFIGURE_DEPENDS/g, 'file(GLOB_RECURSE WORKLETS_COMMON_CPP_SOURCES');
  content = content.replace(/file\(GLOB_RECURSE WORKLETS_ANDROID_CPP_SOURCES CONFIGURE_DEPENDS/g, 'file(GLOB_RECURSE WORKLETS_ANDROID_CPP_SOURCES');
  fs.writeFileSync(p, content, 'utf8');
  console.log('Successfully patched worklets CMakeLists.txt');
} else {
  console.error('Worklets CMakeLists.txt not found');
}

// Clean worklets .cxx
const cxx = '\\\\?\\C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\.cxx';
if (fs.existsSync(cxx)) {
  fs.rmSync(cxx, { recursive: true, force: true });
  console.log('Cleaned worklets .cxx');
}
