const path = require('path');

module.exports = {
  entry: './public/javascripts/capuchin.mjs',
  output: {
    filename: 'capuchin.mjs',
    path: path.resolve(__dirname, 'docs/static/javascripts'),
  },
  optimization: {
    innerGraph: true, 
     usedExports: true

  },
};