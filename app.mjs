import autoLoader from "./src/routeAutoLoader.cjs" ;
import config from "./src/configPugLocals.cjs" ;
import cookieParser from "cookie-parser" ;
import databaseConnector from "./src/databaseConnector.mjs" ;
import dotenv from "dotenv" ;
import errorHandler from "./routes/_error.js" ;
import express from "express" ;
import logger from "morgan" ;
import path from "path" ;
import sassMiddleware from "node-sass-middleware" ;

dotenv.config() ;
const app = express() ;
if( app.get( "env" ) ) app.use( logger( "dev" ) ) ;

app.use( express.json() ) ;
app.use( express.urlencoded( { extended: false } ) ) ;
app.use( cookieParser() ) ;

/** Use scss on demand */
app.use( sassMiddleware(
  { src            : path.join( process.env.PWD, "public" )
  , dest           : path.join( process.env.PWD, "public" )
  , indentedSyntax : false // .scss
  , sourceMap      : true
  } ) ) ;

/** Static routes : css, images, and app js*/
app.use( express.static( path.join( process.env.PWD, "public" ) ) ) ;

/** Static routes : libraries */
app.use( "/javascripts", express.static( path.join( process.env.PWD, "node_modules/jquery/dist" ) ) ) ;
app.use( "/javascripts", express.static( path.join( process.env.PWD, "node_modules/materialize-css/dist/js" ) ) ) ;

/** Autoloading routes */
app.set( "views", path.join( process.env.PWD, "views" ) ) ;
app.set( "view engine", "pug" ) ;


app.locals = config() ;
app.use( autoLoader( ) ) ;
// create a database connector
app.set( "connector", databaseConnector() ) ;

/** Error handling */
app.use( errorHandler ) ;

export default app ;
