const fs = require('fs');

const fixGradle = (filePath) => {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    const targetBlock = /def fixPath = \{ String p ->[\s\S]*?return p\s*\}/;
    const replacement = `def fixPath = { String p ->
    String drive = rootDir.getAbsolutePath().substring(0, 2)
    return p.replace("C:\\\\cinmax-build\\\\Cinmax-Dev", drive).replace("C:/cinmax-build/Cinmax-Dev", drive)
}`;
    content = content.replace(targetBlock, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed fixPath in ' + filePath);
  }
};

fixGradle('C:\\Users\\Mownika Kanagaraj\\OneDrive\\Desktop\\Cinmax-Dev\\apps\\mobile\\android\\app\\build.gradle');
fixGradle('C:\\cinmax-build\\Cinmax-Dev\\apps\\mobile\\android\\app\\build.gradle');
