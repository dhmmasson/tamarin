/* eslint global-require: 0, no-continue: 0, no-sync:0*/
/**
 * @file routeAutoLoader - this file automatically set the route from the routes folder
 * @author dhmmasson
 * @memberof! module:ExpressUtils
 */
const fs = require( "fs" ) ;
const path = require( "path" ) ;
const express = require( "express" ) ;


/**
 * loadFiles - load the routes from the routes folder, only consider .js files, skip files that start by a _
 *
* @param  {Express~Application} app the Express application to configure
 * @param  {string=} directory the path to extract the routes from
 * @return {Express~Application}     the Express application configured
 * @memberof! module:ExpressUtils
 * @TODO: Use express-autoroute
 */
function loadFiles( directory ) {
  const root = express.Router() ;
  const baseDirectory = process.env.PWD || path.resolve( __dirname, ".." ) ;
  let routeDirectory = ( directory === undefined ) ? "routes" : directory ;
  routeDirectory = path.isAbsolute( routeDirectory ) ? routeDirectory : path.resolve( baseDirectory, routeDirectory ) ;
  const dirs = fs.readdirSync( routeDirectory ) ;
  for( const file of dirs ) {
    // only get .js file
    if( !RegExp( ".*[.]js$" ).test( file ) ) continue ;
    if( RegExp( "^_.*" ).test( file ) ) continue ;

    try{
      const router = require( path.resolve( routeDirectory, path.basename( file, ".js" ) ) ) ;
      let mount = "/" ;
      if( file === "index.js" ) {
        router.name = "index" ;
        mount = "/" ;
      } else {
        router.name = path.basename( file, ".js" ) ;
        mount = "/" + path.basename( file, ".js" ) ;
      }
      root.use( mount, router ) ;
    } catch( error ) {
      console.warn( "impossible to load " + file ) ;
    }
  }
  return root ;
}

module.exports = loadFiles ;
