const fs = require('fs');

module.exports = function get404(filePath) {
  return fs.readFileSync(require.resolve(filePath), 'utf8');
};
