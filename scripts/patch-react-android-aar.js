const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const scratchDir = path.join(__dirname, '..', 'scratch', 'patch_aar');
const targetSubDir = path.join(scratchDir, 'prefab', 'modules', 'reactnative', 'include', 'react', 'renderer', 'core');
fs.mkdirSync(targetSubDir, { recursive: true });

// Copy the clean file from node_modules which already has std::to_string
const sourceHeader = path.join(__dirname, '..', 'node_modules', 'react-native', 'ReactCommon', 'react', 'renderer', 'core', 'graphicsConversions.h');
const destHeader = path.join(targetSubDir, 'graphicsConversions.h');

let content = fs.readFileSync(sourceHeader, 'utf8');
console.log('Source header contains std::to_string:', content.includes('std::to_string'));
fs.writeFileSync(destHeader, content, 'utf8');

const releaseAar = 'C:\\Users\\Mownika Kanagaraj\\.gradle\\caches\\modules-2\\files-2.1\\com.facebook.react\\react-android\\0.86.3\\a70bffb72c32a275561117caac90ea7ee2b041c9\\react-android-0.86.3-release.aar';
const debugAar = 'C:\\Users\\Mownika Kanagaraj\\.gradle\\caches\\modules-2\\files-2.1\\com.facebook.react\\react-android\\0.86.3\\811474b9e24f783511aebb0863c63cb9cb8edb3b\\react-android-0.86.3-debug.aar';

console.log('Updating release.aar with jar uf...');
execSync(`jar uf "${releaseAar}" prefab/modules/reactnative/include/react/renderer/core/graphicsConversions.h`, { cwd: scratchDir, stdio: 'inherit' });

console.log('Updating debug.aar with jar uf...');
execSync(`jar uf "${debugAar}" prefab/modules/reactnative/include/react/renderer/core/graphicsConversions.h`, { cwd: scratchDir, stdio: 'inherit' });

console.log('Successfully updated both AARs!');
