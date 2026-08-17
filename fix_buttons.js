const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./app/dashboard', function(filePath) {
  if (filePath.endsWith('.tsx')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix button text colors for dark mode
    content = content.replace(/dark:bg-slate-50 text-white/g, 'dark:bg-slate-50 text-white dark:text-slate-900');
    content = content.replace(/dark:bg-white text-white/g, 'dark:bg-white text-white dark:text-slate-900');
    content = content.replace(/bg-slate-900 dark:bg-slate-50 text-white/g, 'bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900');
    content = content.replace(/bg-slate-900 text-white/g, 'bg-slate-900 text-white dark:text-slate-900'); // Be careful, but let's be specific

    // Specifically for DashboardClient.tsx and others where the order might be different:
    content = content.replace(/text-white px-6 py-3/g, 'text-white dark:text-slate-900 px-6 py-3');
    content = content.replace(/text-white px-6 py-2.5/g, 'text-white dark:text-slate-900 px-6 py-2.5');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
});
