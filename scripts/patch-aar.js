const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const aarPath = 'C:\\g\\caches\\modules-2\\files-2.1\\com.facebook.react\\react-android\\0.86.3\\a70bffb72c32a275561117caac90ea7ee2b041c9\\react-android-0.86.3-release.aar';
const tempDir = path.join(__dirname, 'aar_temp');
const zipCopy = path.join(__dirname, 'aar_copy.zip');

if (fs.existsSync(aarPath)) {
  console.log('Extracting AAR via ZIP...');
  if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
  if (fs.existsSync(zipCopy)) fs.unlinkSync(zipCopy);
  
  fs.copyFileSync(aarPath, zipCopy);
  fs.mkdirSync(tempDir, { recursive: true });

  execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::ExtractToDirectory('${zipCopy}', '${tempDir}')"`);

  const headerPath = path.join(tempDir, 'prefab', 'modules', 'reactnative', 'include', 'react', 'renderer', 'core', 'graphicsConversions.h');
  if (fs.existsSync(headerPath)) {
    console.log('Patching graphicsConversions.h...');
    let code = fs.readFileSync(headerPath, 'utf8');
    if (code.includes('std::format')) {
      code = code.replace(
        'return std::format("{}%", dimension.value);',
        'return (std::to_string(dimension.value) + "%");'
      );
      fs.writeFileSync(headerPath, code, 'utf8');
      console.log('Successfully patched graphicsConversions.h!');
    } else {
      console.log('std::format not present, already clean.');
    }
  }

  console.log('Repacking AAR...');
  fs.unlinkSync(zipCopy);
  execSync(`powershell -NoProfile -Command "Add-Type -AssemblyName System.IO.Compression.FileSystem; [System.IO.Compression.ZipFile]::CreateFromDirectory('${tempDir}', '${zipCopy}')"`);
  
  fs.copyFileSync(zipCopy, aarPath);
  fs.unlinkSync(zipCopy);
  fs.rmSync(tempDir, { recursive: true, force: true });

  console.log('Cleaning Gradle transforms and app build cache...');
  try {
    fs.rmSync('C:\\g\\caches\\9.3.1\\transforms', { recursive: true, force: true });
  } catch(e) {}
  try {
    fs.rmSync('C:\\c\\app', { recursive: true, force: true });
  } catch(e) {}
  try {
    fs.rmSync(path.join(__dirname, '..', 'apps', 'mobile', 'android', 'app', 'build'), { recursive: true, force: true });
  } catch(e) {}

  console.log('AAR patch complete!');
} else {
  console.error('AAR not found at path:', aarPath);
}
