const fs = require('fs');

const paths = [
  '\\\\?\\C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-worklets@0_kz3euctiiz7rdykx4niiese5qe\\node_modules\\react-native-worklets\\android\\.cxx',
  '\\\\?\\C:\\cinmax-build\\Cinmax-Dev\\node_modules\\.pnpm\\react-native-screens@4._3k2fdtof6aefncwhdkzdshvafe\\node_modules\\react-native-screens\\android\\.cxx'
];

for (const p of paths) {
  try {
    if (fs.existsSync(p)) {
      fs.rmSync(p, { recursive: true, force: true });
      console.log('Removed: ' + p);
    } else {
      console.log('Not found: ' + p);
    }
  } catch (err) {
    console.error('Error removing ' + p, err);
  }
}
