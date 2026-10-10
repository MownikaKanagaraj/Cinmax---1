const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const workspaceRoot = path.resolve(__dirname, '..');
const cmRoot = 'C:\\cm';
const desktopDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Mownika Kanagaraj', 'OneDrive', 'Desktop');

function copyDirRecursive(srcDir, dstDir) {
  if (!fs.existsSync(srcDir)) return;
  if (!fs.existsSync(dstDir)) {
    fs.mkdirSync(dstDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(srcDir, entry.name);
    const dstPath = path.join(dstDir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.cxx' || entry.name === 'build' || entry.name === '.expo') {
        continue;
      }
      copyDirRecursive(srcPath, dstPath);
    } else {
      fs.copyFileSync(srcPath, dstPath);
    }
  }
}

console.log('--- 1. Synchronizing updated source files from Workspace to C:\\cm ---');

const dirsToSync = [
  'apps/mobile/src',
  'apps/mobile/assets',
  'apps/mobile/android/app/src/main/res',
  'packages/types/src',
  'packages/api/src',
  'packages/hooks/src',
  'packages/utils/src',
  'packages/ui/src',
];

for (const rel of dirsToSync) {
  const src = path.join(workspaceRoot, rel);
  const dst = path.join(cmRoot, rel);
  console.log(`Syncing directory: ${rel}`);
  copyDirRecursive(src, dst);
}

const individualFiles = [
  'apps/mobile/.env',
  'apps/mobile/.env.local',
  'apps/mobile/metro.config.js',
  'apps/mobile/babel.config.js',
  'apps/mobile/app.json',
  'apps/mobile/package.json',
  'apps/mobile/android/app/src/main/AndroidManifest.xml',
  'packages/types/package.json',
  'packages/api/package.json',
  'packages/hooks/package.json',
  'packages/utils/package.json',
];

for (const rel of individualFiles) {
  const src = path.join(workspaceRoot, rel);
  const dst = path.join(cmRoot, rel);
  if (fs.existsSync(src)) {
    fs.mkdirSync(path.dirname(dst), { recursive: true });
    fs.copyFileSync(src, dst);
    console.log(`Synced file: ${rel}`);
  }
}

console.log('--- 2. Cleaning stale CXX and duplicate resources ---');
try {
  if (fs.existsSync('C:\\cxx')) {
    fs.rmSync('C:\\cxx', { recursive: true, force: true });
  }
  fs.mkdirSync('C:\\cxx', { recursive: true });
  console.log('Created clean C:\\cxx directory.');
} catch (e) {
  console.warn('CXX clean warning:', e.message);
}

const cxxApp = path.join(cmRoot, 'apps/mobile/android/app/.cxx');
if (fs.existsSync(cxxApp)) {
  try {
    fs.rmSync(cxxApp, { recursive: true, force: true });
  } catch (e) {}
}

// Clean duplicate png from mipmaps in C:\cm
const cmResDir = path.join(cmRoot, 'apps/mobile/android/app/src/main/res');
if (fs.existsSync(cmResDir)) {
  for (const folder of ['mipmap-mdpi', 'mipmap-hdpi', 'mipmap-xhdpi', 'mipmap-xxhdpi', 'mipmap-xxxhdpi']) {
    const target = path.join(cmResDir, folder);
    if (fs.existsSync(target)) {
      for (const f of fs.readdirSync(target)) {
        if (f.endsWith('.png')) {
          try { fs.unlinkSync(path.join(target, f)); } catch (e) {}
        }
      }
    }
  }
}

console.log('--- 3. Running assembleRelease in C:\\cm\\apps\\mobile\\android ---');
const androidDir = path.join(cmRoot, 'apps/mobile/android');

try {
  execSync('cmd.exe /c ".\\gradlew.bat assembleRelease --no-daemon"', {
    cwd: androidDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      JAVA_HOME: process.env.JAVA_HOME || 'C:\\Users\\Mownika Kanagaraj\\AppData\\Local\\AndroidTools\\jdk-17',
    },
  });
  console.log('--- GRADLE BUILD SUCCESSFUL ---');
} catch (err) {
  console.error('Build failed:', err.message);
  process.exit(1);
}

console.log('--- 4. Locating and Copying Release APK ---');
const sourceApk = path.join(cmRoot, 'apps/mobile/android/app/build/outputs/apk/release/app-release.apk');

if (fs.existsSync(sourceApk)) {
  const stat = fs.statSync(sourceApk);
  const sizeMb = (stat.size / (1024 * 1024)).toFixed(2);
  const targetApk = path.join(desktopDir, 'CINMAX-app-release.apk');
  const workspaceApk = path.join(workspaceRoot, 'CINMAX-app-release.apk');
  
  fs.copyFileSync(sourceApk, targetApk);
  fs.copyFileSync(sourceApk, workspaceApk);
  console.log(`\n========================================`);
  console.log(`BUILD SUCCESSFUL!`);
  console.log(`Source APK: ${sourceApk}`);
  console.log(`Desktop APK: ${targetApk}`);
  console.log(`Workspace APK: ${workspaceApk}`);
  console.log(`Size: ${sizeMb} MB (${stat.size} bytes)`);
  console.log(`Updated at: ${new Date().toISOString()}`);
  console.log(`========================================\n`);
} else {
  console.error(`APK was not found at expected path: ${sourceApk}`);
  process.exit(1);
}
