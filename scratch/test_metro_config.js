const { getDefaultConfig } = require('expo/metro-config');
const config = getDefaultConfig(__dirname + '/../apps/mobile');
console.log('Config keys:', Object.keys(config));
console.log('Resolver keys:', Object.keys(config.resolver));
if (config.watcher) console.log('Watcher keys:', Object.keys(config.watcher));
if (config.haste) console.log('Haste keys:', Object.keys(config.haste));
