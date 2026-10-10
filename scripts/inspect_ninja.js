const fs = require('fs');

const f1 = 'C:\\Users\\Mownika Kanagaraj\\AppData\\Local\\Android\\Sdk\\cmake\\3.22.1\\share\\cmake-3.22\\Modules\\CMakeCInformation.cmake';
const f2 = 'C:\\cinmax-build\\android-sdk\\cmake\\3.22.1\\share\\cmake-3.22\\Modules\\CMakeCInformation.cmake';

if (fs.existsSync(f1)) {
  console.log('f1 mtime:', fs.statSync(f1).mtime.toISOString(), 'now:', new Date().toISOString());
}
if (fs.existsSync(f2)) {
  console.log('f2 mtime:', fs.statSync(f2).mtime.toISOString());
}
