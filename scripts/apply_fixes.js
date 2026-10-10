const fs = require('fs');
const path = require('path');

// 1. Clean legacy worklets in src/main/cpp if present
const workletsDir = 'C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets';
const mainWorkletsDir = path.join(workletsDir, 'android\\src\\main\\cpp\\worklets');
if (fs.existsSync(mainWorkletsDir)) {
  fs.rmSync('\\\\?\\' + mainWorkletsDir, { recursive: true, force: true });
  console.log('Removed duplicate worklets in src/main/cpp');
}

// 2. Metro config with node builtins and monorepo singletons
const metroConfig = `const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');
const emptyModulePath = path.resolve(projectRoot, 'src/empty-module.js');

const config = getDefaultConfig(projectRoot);

// Enable pnpm symlink resolution in Metro and fallback doesFileExist for .pnpm store
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
config.resolver.doesFileExist = (filePath) => fs.existsSync(filePath);

// 1. Exclude non-mobile build artifacts from file-map crawling
config.resolver.blockList = [
  /apps[/\\\\]website[/\\\\].next[/\\\\].*/,
  /apps[/\\\\]admin[/\\\\].next[/\\\\].*/,
  /\\.git[/\\\\].*/,
  /\\.turbo[/\\\\].*/,
  /scratch[/\\\\]\\.temp[/\\\\].*/,
  /supabase[/\\\\]\\.temp[/\\\\].*/,
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
  '@tanstack/react-query': require.resolve('@tanstack/react-query', { paths: [projectRoot, monorepoRoot] }),
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react-dom': path.resolve(projectRoot, 'node_modules/react-dom'),
  expo: path.resolve(projectRoot, 'node_modules/expo'),
  'expo-modules-core': path.resolve(projectRoot, 'node_modules/expo-modules-core'),
};

nodeBuiltins.forEach((builtin) => {
  config.resolver.extraNodeModules[builtin] = emptyModulePath;
});

config.resolver.extraNodeModules['react-native/Libraries/Renderer/shims/ReactNative'] = require.resolve(
  'react-native/Libraries/Renderer/shims/ReactFabric',
  { paths: [projectRoot, monorepoRoot] }
);

module.exports = withNativeWind(config, { input: './global.css' });
`;

fs.writeFileSync('C:\\Users\\Mownika Kanagaraj\\OneDrive\\Desktop\\Cinmax-Dev\\apps\\mobile\\metro.config.js', metroConfig, 'utf8');
fs.writeFileSync('C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\metro.config.js', metroConfig, 'utf8');
console.log('Updated metro.config.js in workspace and cinmax-build');
