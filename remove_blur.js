const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.next') {
        processDir(fullPath);
      }
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const originalContent = content;
      
      // Remove all backdrop-blur classes
      content = content.replace(/backdrop-blur(-\w+)?/g, '');
      // Clean up multiple spaces that might result from replacing
      content = content.replace(/  +/g, ' ');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
