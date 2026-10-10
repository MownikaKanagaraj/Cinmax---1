const fs = require('fs');

const p = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\CMakeLists.txt';
if (fs.existsSync(p)) {
  let content = fs.readFileSync(p, 'utf8');
  
  // Add CMAKE_OBJECT_PATH_MAX 1024 at top
  if (!content.includes('CMAKE_OBJECT_PATH_MAX')) {
    content = 'set(CMAKE_OBJECT_PATH_MAX 1024)\n' + content;
  }
  
  // Change absolute paths to relative paths
  content = content.replace('set(ANDROID_CPP_DIR "${CMAKE_SOURCE_DIR}/src/main/cpp")', 'set(ANDROID_CPP_DIR "src/main/cpp")');
  content = content.replace('set(COMMON_CPP_DIR "${CMAKE_SOURCE_DIR}/../Common/cpp")', 'set(COMMON_CPP_DIR "../Common/cpp")');
  
  fs.writeFileSync(p, content, 'utf8');
  console.log('Successfully patched worklets CMakeLists.txt with relative paths and CMAKE_OBJECT_PATH_MAX');
} else {
  console.error('Worklets CMakeLists.txt not found');
}
