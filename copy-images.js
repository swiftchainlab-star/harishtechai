const fs = require('fs');
const path = require('path');

const srcDir = '/Users/nilesh/.gemini/antigravity-ide/brain/806ca7cc-bd80-423e-b1a3-65e6a21ebd15';
const destDir = path.join(__dirname, 'assets');

const files = {
  'media__1784544949333.jpg': 'course-sysdesign.jpg',
  'media__1784544949368.jpg': 'course-ios.jpg',
  'media__1784544949388.jpg': 'course-cyber.jpg',
  'media__1784544949399.jpg': 'course-blockchain.jpg',
  'media__1784545027308.png': 'course-dp.png'
};

if (!fs.existsSync(destDir)){
    fs.mkdirSync(destDir);
}

Object.entries(files).forEach(([srcName, destName]) => {
  const srcPath = path.join(srcDir, srcName);
  const destPath = path.join(destDir, destName);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Successfully copied ${srcName} to ${destName}`);
  } else {
    console.log(`Source file does not exist: ${srcPath}`);
  }
});
