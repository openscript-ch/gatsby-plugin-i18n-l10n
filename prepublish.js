const fs = require('fs');

fs.copyFileSync('package.json', 'dist/package.json');
fs.copyFileSync('LICENSE', 'dist/LICENSE');