const fs = require('fs');

const src = 'C:\\Users\\Mownika Kanagaraj\\OneDrive\\Desktop\\Cinmax-Dev\\apps\\mobile\\babel.config.js';
const dst = 'C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\babel.config.js';

fs.copyFileSync(src, dst);
console.log('Copied babel.config.js to cinmax-build');
