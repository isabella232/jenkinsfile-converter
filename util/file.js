const fs = require('fs');

const openFile = (path) => fs.readFileSync(path, { encoding: 'utf8' });

module.exports = { openFile };
