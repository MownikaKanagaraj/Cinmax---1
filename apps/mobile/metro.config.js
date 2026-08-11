const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro resolve packages in workspace & pnpm virtual store
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules/.pnpm'),
];

// 3. Precise resolveRequest hook for PNPM monorepo singletons
const reactFile = require.resolve('react', { paths: [projectRoot] });
const reactNativeFile = require.resolve('react-native', { paths: [projectRoot] });
const reactDomFile = require.resolve('react-dom', { paths: [projectRoot] });

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react') {
    return { type: 'sourceFile', filePath: reactFile };
  }
  if (moduleName === 'react-native') {
    return { type: 'sourceFile', filePath: reactNativeFile };
  }
  if (moduleName === 'react-dom') {
    return { type: 'sourceFile', filePath: reactDomFile };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
