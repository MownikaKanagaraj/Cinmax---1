const fs = require('fs');

// 1. Fix babel.config.js
const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      [require.resolve('babel-preset-expo'), { jsxImportSource: 'nativewind' }],
      require.resolve('nativewind/babel'),
    ],
    plugins: [],
  };
};
`;

fs.writeFileSync('C:\\Users\\Mownika Kanagaraj\\OneDrive\\Desktop\\Cinmax-Dev\\apps\\mobile\\babel.config.js', babelConfig, 'utf8');
fs.writeFileSync('C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\babel.config.js', babelConfig, 'utf8');
console.log('Updated babel.config.js in workspace and cinmax-build');

// 2. Fix react-native-worklets build.gradle.kts duplicate strategy
const ktsPath = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\build.gradle.kts';
if (fs.existsSync(ktsPath)) {
  let kts = fs.readFileSync(ktsPath, 'utf8');
  kts = kts.replace(
    'tasks.register<Copy>("prepareWorkletsHeadersForPrefabs") {',
    'tasks.register<Copy>("prepareWorkletsHeadersForPrefabs") {\n    duplicatesStrategy = DuplicatesStrategy.INCLUDE'
  );
  fs.writeFileSync(ktsPath, kts, 'utf8');
  console.log('Updated worklets build.gradle.kts with DuplicatesStrategy.INCLUDE');
}
