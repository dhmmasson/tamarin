require( "dotenv" ).config() ;
const express = require( "express" ) ;
const path = require( "path" ) ;
const cookieParser = require( "cookie-parser" ) ;
const logger = require( "morgan" ) ;
const sassMiddleware = require( "node-sass-middleware" ) ;
const errorHandler = require( "./routes/_error" ) ;

const app = express() ;
if( app.get( "env" ) ) app.use( logger( "dev" ) ) ;

app.use( express.json() ) ;
app.use( express.urlencoded( { extended: false } ) ) ;
app.use( cookieParser() ) ;

/** Use scss on demand */
app.use( sassMiddleware(
  { src            : path.join( __dirname, "public" )
  , dest           : path.join( __dirname, "public" )
  , indentedSyntax : false // .scss
  , sourceMap      : true
  } ) ) ;

/** Static routes : css, images, and app js*/
app.use( express.static( path.join( __dirname, "public" ) ) ) ;

/** Static routes : libraries */
app.use( "/javascripts", express.static( path.join( __dirname, "node_modules/jquery/dist" ) ) ) ;
app.use( "/javascripts", express.static( path.join( __dirname, "node_modules/materialize-css/dist/js" ) ) ) ;

/** Autoloading routes */
app.set( "views", path.join( __dirname, "views" ) ) ;
app.set( "view engine", "pug" ) ;
require( "./src/configPugLocals" )( app ) ;
require( "./src/routeAutoLoader" )( app ) ;

/** Error handling */
app.use( errorHandler.handle404 ) ;

module.exports = app ;
