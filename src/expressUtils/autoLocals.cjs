/**
 * @file ConfigPugLocals - this file set some locals value for pug, namely author's names, title and description from the package.json file
 * @author dhmmasson
 * @memberof! module:ExpressUtils
 */

const packageJson = require("../../package.json");

/**
 * setLocals - set the pug locals
 *
 * @param  {Express~Application} app the Express application to configure
 * @return {Express~Application}     the Express application configured
 * @memberof! module:ExpressUtils
 */
function setLocals() {
  const locals = {
    __appTitle: packageJson.name,
    __appDescription: packageJson.description,
    __appAuthors: packageJson.author,
    __appHomePage: packageJson.homepage,
  };
  return locals;
}

module.exports = setLocals;
