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
    
    // Replace CSS variables
    content = content.replace(/text-\[var\(--text-primary\)\]/g, 'text-slate-900');
    content = content.replace(/bg-\[var\(--text-primary\)\]/g, 'bg-slate-900');
    
    // Accent colors
    content = content.replace(/text-\[var\(--accent-rosegold\)\]/g, 'text-slate-900 dark:text-white');
    content = content.replace(/bg-\[var\(--accent-rosegold\)\]/g, 'bg-slate-900 dark:bg-slate-50');
    content = content.replace(/border-\[var\(--accent-rosegold\)\]/g, 'border-slate-900 dark:border-white');
    content = content.replace(/accent-\[var\(--accent-rosegold\)\]/g, 'accent-slate-900 dark:accent-white');
    
    // Hover accent colors
    content = content.replace(/hover:bg-\[var\(--accent-rosegold\)\]/g, 'hover:bg-slate-800 dark:hover:bg-slate-200');
    content = content.replace(/hover:text-\[var\(--accent-rosegold\)\]/g, 'hover:text-slate-900 dark:hover:text-white');
    content = content.replace(/hover:border-\[var\(--accent-rosegold\)\]/g, 'hover:border-slate-900 dark:hover:border-white');
    content = content.replace(/group-hover:bg-\[var\(--accent-rosegold\)\]/g, 'group-hover:bg-slate-900 dark:group-hover:bg-white');
    content = content.replace(/group-hover:text-\[var\(--accent-rosegold\)\]/g, 'group-hover:text-slate-900 dark:group-hover:text-white');
    content = content.replace(/hover:bg-\[var\(--accent-rosegold-hover\)\]/g, 'hover:bg-slate-800 dark:hover:bg-slate-200');

    // Rounded classes (excluding avatars which usually have w-8 or w-10 or w-12 next to them)
    content = content.replace(/rounded-3xl/g, 'rounded-none');
    content = content.replace(/rounded-2xl/g, 'rounded-none');
    content = content.replace(/rounded-xl/g, 'rounded-none');
    content = content.replace(/rounded-lg/g, 'rounded-none');
    
    // Badges and buttons usually have px- or py- followed by rounded-full
    content = content.replace(/px-([0-9a-z.]+) py-([0-9a-z.]+) rounded-full/g, 'px-$1 py-$2 rounded-none');
    
    // Some bg-transparent borders might still use emerald/amber/rose. We'll leave those for specific status labels, but remove rounded-full from them.
    content = content.replace(/rounded-full text-\[10px\]/g, 'rounded-none text-[10px]');
    
    fs.writeFileSync(filePath, content);
    console.log(`Updated: ${filePath}`);
  }
});
