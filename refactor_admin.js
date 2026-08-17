const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function refactorAdmin() {
  const dirs = ['./app/admin', './components/admin'];
  
  dirs.forEach(dir => {
    walkDir(dir, function(filePath) {
      if (filePath.endsWith('.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // 1. Fix Layout
        if (filePath.includes('layout.tsx')) {
          content = content.replace(/bg-slate-950 text-slate-200/g, 'bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50');
        }
        
        // 2. Fix Sidebar Colors
        if (filePath.includes('Sidebar.tsx')) {
          content = content.replace(/text-rose-500/g, 'text-slate-900 dark:text-white');
          content = content.replace(/bg-rose-500\/10/g, 'bg-slate-200 dark:bg-slate-800');
          content = content.replace(/hover:text-rose-400/g, 'hover:text-slate-900 dark:hover:text-white');
          content = content.replace(/hover:bg-rose-500\/10/g, 'hover:bg-slate-200 dark:hover:bg-slate-800');
          content = content.replace(/bg-slate-900/g, 'bg-slate-50 dark:bg-slate-900');
          content = content.replace(/border-slate-800/g, 'border-slate-200 dark:border-slate-800');
          content = content.replace(/text-slate-400 hover:text-slate-200/g, 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200');
          content = content.replace(/hover:bg-slate-800/g, 'hover:bg-slate-200 dark:hover:bg-slate-800');
          content = content.replace(/text-white/g, 'text-slate-900 dark:text-white');
        }
        
        // 3. Remove rounded corners universally
        content = content.replace(/rounded-3xl/g, 'rounded-none');
        content = content.replace(/rounded-2xl/g, 'rounded-none');
        content = content.replace(/rounded-xl/g, 'rounded-none');
        content = content.replace(/rounded-lg/g, 'rounded-none');
        content = content.replace(/rounded-md/g, 'rounded-none');
        
        // 4. Other fixes (e.g. padding and margins on Sidebar icons if needed, but not strictly necessary)
        
        fs.writeFileSync(filePath, content);
        console.log(`Updated: ${filePath}`);
      }
    });
  });
}

refactorAdmin();
