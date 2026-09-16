const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const emptyModulePath = path.resolve(projectRoot, 'src/empty-module.js');

const config = getDefaultConfig(projectRoot);

// 1. Exclude non-mobile build artifacts from file-map crawling
config.resolver.blockList = [
  /apps[/\\]website[/\\]\.next[\\/].*/,
  /apps[/\\]admin[/\\]\.next[\\/].*/,
  /\.git[\\/].*/,
  /\.turbo[\\/].*/,
  /scratch[/\\]\.temp[\\/].*/,
  /supabase[/\\]\.temp[\\/].*/,
];

// 2. Watch all files in the monorepo
config.watchFolders = [monorepoRoot, projectRoot];

// 3. Let Metro resolve packages in mobile and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 4. Extra node modules for monorepo and Node builtins
const nodeBuiltins = [
  'crypto', 'stream', 'fs', 'path', 'http', 'https', 'url', 'zlib', 'os', 'child_process',
  'events', 'buffer', 'net', 'tls', 'util', 'assert', 'string_decoder', 'vm', 'async_hooks'
];

config.resolver.extraNodeModules = {
  '@tanstack/react-query': require.resolve('@tanstack/react-query'),
};

nodeBuiltins.forEach((builtin) => {
  config.resolver.extraNodeModules[builtin] = emptyModulePath;
});

const reactNativeFabricShim = require.resolve('react-native/Libraries/Renderer/shims/ReactFabric', { paths: [projectRoot, monorepoRoot] });

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/Libraries/Renderer/shims/ReactNative') {
    return {
      filePath: reactNativeFabricShim,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
