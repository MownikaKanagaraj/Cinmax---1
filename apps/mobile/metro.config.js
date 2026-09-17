const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const emptyModulePath = path.resolve(projectRoot, 'src/empty-module.js');

const config = getDefaultConfig(projectRoot);

// Disable pnpm symlink target resolution in Metro to prevent .pnpm SHA-1 file watcher errors
config.resolver.unstable_enableSymlinks = false;
config.resolver.unstable_enablePackageExports = false;
config.watcher.unstable_lazySha1 = true;

// 1. Exclude non-mobile build artifacts from file-map crawling
config.resolver.blockList = [
  /apps[/\\]website[/\\]\.next[\\/].*/,
  /apps[/\\]admin[/\\]\.next[\\/].*/,
  /\.git[\\/].*/,
  /\.turbo[\\/].*/,
  /scratch[/\\]\.temp[\\/].*/,
  /supabase[/\\]\.temp[\\/].*/,
];

// 2. Watch all files in the monorepo and pnpm store
config.watchFolders = [
  monorepoRoot,
  projectRoot,
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules/.pnpm'),
];

// 3. Let Metro resolve packages in mobile and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 4. Node builtins and mock overrides
const nodeBuiltins = new Set([
  'crypto', 'stream', 'fs', 'path', 'http', 'https', 'url', 'zlib', 'os', 'child_process',
  'events', 'buffer', 'net', 'tls', 'util', 'assert', 'string_decoder', 'vm', 'async_hooks'
]);

const reactNativeFabricShim = require.resolve('react-native/Libraries/Renderer/shims/ReactFabric', { paths: [projectRoot, monorepoRoot] });

const reactIsStubPath = path.resolve(projectRoot, 'src/react-is-stub.js');

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'react-native/Libraries/Renderer/shims/ReactNative') {
    return {
      filePath: reactNativeFabricShim,
      type: 'sourceFile',
    };
  }
  if (moduleName === './types' && context.originModulePath && context.originModulePath.includes('expo-router')) {
    return {
      filePath: emptyModulePath,
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-is' || moduleName.startsWith('react-is/')) {
    return {
      filePath: reactIsStubPath,
      type: 'sourceFile',
    };
  }
  if (
    moduleName === 'react-native-reanimated' ||
    nodeBuiltins.has(moduleName) ||
    moduleName.includes('empty-module') ||
    moduleName.includes('@supabase/ssr') ||
    moduleName === './client/server' ||
    (moduleName.includes('typeAliases') && !moduleName.includes('TypedArrays')) ||
    moduleName.includes('enumUtil') ||
    moduleName.includes('partialUtil') ||
    (moduleName.includes('types') && !moduleName.includes('TypedArrays') && context.originModulePath && context.originModulePath.includes('@supabase'))
  ) {
    return {
      filePath: emptyModulePath,
      type: 'sourceFile',
    };
  }

  const { resolveRequest, ...cleanContext } = context;
  let res;
  try {
    res = context.resolveRequest(cleanContext, moduleName, platform);
  } catch (err) {
    if (context.originModulePath && (moduleName.startsWith('.') || moduleName.startsWith('/') || moduleName.startsWith('\\'))) {
      const originDir = path.dirname(context.originModulePath);
      const exactPath = path.resolve(originDir, moduleName);
      if (fs.existsSync(exactPath) && fs.statSync(exactPath).isFile()) {
        res = {
          filePath: exactPath,
          type: 'sourceFile',
        };
      }
    }
    if (!res && !moduleName.startsWith('.') && !moduleName.startsWith('/') && !moduleName.startsWith('\\')) {
      try {
        const resolved = require.resolve(moduleName, { paths: [context.originModulePath, projectRoot, monorepoRoot] });
        res = {
          filePath: resolved,
          type: 'sourceFile',
        };
      } catch (e) {}
    }
    if (!res) throw err;
  }

  if (res && res.filePath) {
    if (res.filePath.includes('empty-module')) {
      return { ...res, filePath: emptyModulePath };
    }
    if (res.filePath.includes('.pnpm')) {
      const parts = res.filePath.split(/[\\/]node_modules[\\/]/);
      if (parts.length > 1) {
        const relPath = parts[parts.length - 1];
        const rootNmPath = path.resolve(monorepoRoot, 'node_modules', relPath);
        const mobileNmPath = path.resolve(projectRoot, 'node_modules', relPath);
        if (fs.existsSync(rootNmPath) && fs.statSync(rootNmPath).isFile()) {
          return { ...res, filePath: rootNmPath };
        }
        if (fs.existsSync(mobileNmPath) && fs.statSync(mobileNmPath).isFile()) {
          return { ...res, filePath: mobileNmPath };
        }
      }
    }
  }

  return res;
};

module.exports = withNativeWind(config, { input: './global.css' });
