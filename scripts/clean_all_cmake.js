const fs = require('fs');

const content = 'sdk.dir=C:/cinmax-build/android-sdk\ncmake.dir=C:/cinmax-build/android-sdk/cmake/3.22.1\n';

const targets = [
  'C:\\cinmax-build\\Cinmax-Dev\\local.properties',
  'C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\android\\local.properties'
];

for (const t of targets) {
  try {
    fs.writeFileSync(t, content, 'utf8');
    console.log('Written to ' + t);
  } catch (err) {
    console.error('Error writing to ' + t, err);
  }
}
