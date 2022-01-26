const fs = require('fs');

fs.copyFileSync('./LICENSE', './dist/LICENSE');
fs.copyFileSync('./package.json', './dist/package.json');
fs.copyFileSync('./README.md', './dist/README.md');
fs.copyFileSync('./types.d.ts', './dist/types.d.ts');