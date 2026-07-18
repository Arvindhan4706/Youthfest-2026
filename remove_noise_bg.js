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
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const originalContent = content;
      
      // Replace the muddy dark teal background with pure black
      content = content.replace(/#011213/g, '#000000');
      content = content.replace(/bg-\[\#000000\]/g, 'bg-black');
      
      // Remove radial gradients that might be creating "muddy" or "noisy" spots in the background
      content = content.replace(/<div[^>]*bg-\[radial-gradient[^>]*\/>/g, '');
      content = content.replace(/bg-\[radial-gradient[^\]]*\]/g, '');
      
      // Remove the inner shadow from page.tsx secret mode which adds a huge gradient
      content = content.replace(/shadow-\[inset_0_0_100px[^\]]*\]/g, '');
      
      // Clean up empty lines that might have been left by removing divs
      content = content.replace(/^\s*[\r\n]/gm, '');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
