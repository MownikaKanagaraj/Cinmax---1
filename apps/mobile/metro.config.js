const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const emptyModulePath = path.resolve(projectRoot, 'src/empty-module.js');

const config = getDefaultConfig(projectRoot);

// Enable pnpm symlink resolution in Metro
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = false;
config.resolver.disableHierarchicalLookup = true;

// 1. Exclude non-mobile build artifacts from file-map crawling
config.resolver.blockList = [
  /apps[/\\]website[/\\].next[/\\].*/,
  /apps[/\\]admin[/\\].next[/\\].*/,
  /\.git[/\\].*/,
  /\.turbo[/\\].*/,
  /scratch[/\\]\.temp[/\\].*/,
  /supabase[/\\]\.temp[/\\].*/,
];

// 2. Watch all files in the monorepo and pnpm virtual store
const pnpmVirtualStore = path.resolve(monorepoRoot, 'node_modules/.pnpm');
const realMonorepoRoot = fs.realpathSync(monorepoRoot);
const realProjectRoot = fs.realpathSync(projectRoot);

config.watchFolders = Array.from(new Set([
  monorepoRoot,
  projectRoot,
  realMonorepoRoot,
  realProjectRoot,
  ...(fs.existsSync(pnpmVirtualStore) ? [pnpmVirtualStore, fs.realpathSync(pnpmVirtualStore)] : [])
]));

// 3. Let Metro resolve packages in mobile and workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
  path.resolve(realMonorepoRoot, 'node_modules'),
];

function resolvePkg(pkgName) {
  try {
    return path.dirname(require.resolve(`${pkgName}/package.json`, { paths: [projectRoot, monorepoRoot] }));
  } catch (e) {
    if (fs.existsSync(path.resolve(projectRoot, 'node_modules', pkgName))) {
      return path.resolve(projectRoot, 'node_modules', pkgName);
    }
    return path.resolve(monorepoRoot, 'node_modules', pkgName);
  }
}

// 4. Extra node modules for monorepo and Node builtins
const builtinModuleList = (require('module').builtinModules || []).concat([
  'crypto', 'stream', 'fs', 'path', 'http', 'https', 'http2', 'url', 'zlib', 'os', 'child_process',
  'events', 'buffer', 'net', 'tls', 'util', 'assert', 'string_decoder', 'vm', 'async_hooks',
  'punycode', 'querystring', 'timers', 'constants', 'dns', 'dgram', 'module', 'process',
  'worker_threads', 'perf_hooks', 'diagnostics_channel', 'v8', 'inspector', 'wasi', 'trace_events'
]);
const nodeBuiltins = new Set(builtinModuleList);
builtinModuleList.forEach(m => nodeBuiltins.add(`node:${m}`));

const knownModules = {
  '@tanstack/react-query': resolvePkg('@tanstack/react-query'),
  '@expo/metro-runtime': resolvePkg('@expo/metro-runtime'),
  'expo-router': resolvePkg('expo-router'),
  react: resolvePkg('react'),
  'react-native': resolvePkg('react-native'),
  'react-dom': resolvePkg('react-dom'),
  expo: resolvePkg('expo'),
  'expo-modules-core': resolvePkg('expo-modules-core'),
  'expo-constants': resolvePkg('expo-constants'),
  'react-is': resolvePkg('react-is'),
  'react-freeze': resolvePkg('react-freeze'),
  zod: resolvePkg('zod'),
};

nodeBuiltins.forEach((builtin) => {
  knownModules[builtin] = emptyModulePath;
});



config.resolver.extraNodeModules = new Proxy(knownModules, {
  get: (target, name) => {
    if (name in target) {
      return target[name];
    }
    if (typeof name === 'string' && !name.startsWith('.') && !name.startsWith('/') && !name.startsWith('@/')) {
      const pkgPath = resolvePkg(name);
      if (pkgPath && fs.existsSync(pkgPath)) {
        return pkgPath;
      }
    }
    return undefined;
  },
});

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const cleanModuleName = moduleName.replace(/^node:/, '');
  if (nodeBuiltins.has(cleanModuleName)) {
    return {
      filePath: emptyModulePath,
      type: 'sourceFile',
    };
  }
  if (moduleName === '@expo/metro-runtime' && platform !== 'web') {
    return {
      filePath: emptyModulePath,
      type: 'sourceFile',
    };
  }
  if (moduleName === 'react-native-reanimated') {
    return {
      filePath: emptyModulePath,
      type: 'sourceFile',
    };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' });
