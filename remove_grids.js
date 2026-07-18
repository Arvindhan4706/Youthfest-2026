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
      
      if (fullPath.endsWith('.css')) {
          // It's fine to leave the CSS definitions, but we can remove the HTML elements
          continue;
      }

      const originalContent = content;
      
      // Remove any lines that contain bg-grid, bg-grid-dense, or bg-dots and end with />
      content = content.split('\n').filter(line => {
        return !line.match(/className="[^"]*(bg-grid|bg-grid-dense|bg-dots)[^"]*"/);
      }).join('\n');
      
      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated: ' + fullPath);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Done!');
