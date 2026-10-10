const path = require('path');

const projectRoot = 'C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile';
const expoPkg = require.resolve('expo/package.json', { paths: [projectRoot] });
const expoDir = path.dirname(expoPkg);

console.log('expoDir:', expoDir);
const preset = require.resolve('babel-preset-expo', { paths: [expoDir, projectRoot] });
console.log('Found babel-preset-expo:', preset);
