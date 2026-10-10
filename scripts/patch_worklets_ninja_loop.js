const fs = require('fs');

// Patch build.gradle.kts
const ktsPath = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\build.gradle.kts';
if (fs.existsSync(ktsPath)) {
  let kts = fs.readFileSync(ktsPath, 'utf8');
  kts = kts.replace('apply(from = "./fix-prefab.gradle.kts")', '// apply(from = "./fix-prefab.gradle.kts")');
  kts = kts.replace('apply(from = "./generate-stub-pch.gradle.kts")', '// apply(from = "./generate-stub-pch.gradle.kts")');
  fs.writeFileSync(ktsPath, kts, 'utf8');
  console.log('Successfully patched build.gradle.kts (disabled fix-prefab and generate-stub-pch)');
}

// Patch CMakeLists.txt
const cmakePath = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\CMakeLists.txt';
if (fs.existsSync(cmakePath)) {
  let cmake = fs.readFileSync(cmakePath, 'utf8');
  cmake = cmake.replace('target_precompile_headers(worklets', '# target_precompile_headers(worklets');
  fs.writeFileSync(cmakePath, cmake, 'utf8');
  console.log('Successfully patched CMakeLists.txt (disabled PCH)');
}
