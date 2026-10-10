const path = require('path');

module.exports = function (api) {
  api.cache(true);

  const expoDir = path.dirname(require.resolve('expo/package.json', { paths: [__dirname] }));
  const babelPresetExpo = require.resolve('babel-preset-expo', { paths: [expoDir, __dirname] });
  const nativewindBabel = require.resolve('nativewind/babel', { paths: [__dirname] });

  return {
    presets: [
      [babelPresetExpo, { jsxImportSource: 'nativewind', reanimated: false, worklets: false }],
      nativewindBabel,
    ],
    plugins: [],
  };
};
