const path = require('path');
const mode = process.env.NODE_ENV || 'development';
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
  mode: mode,
  devtool: (mode === 'development') ? 'source-map': false ,
  
}