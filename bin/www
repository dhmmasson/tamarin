#!/usr/bin/env node

/**
 * Module dependencies.
 */
import * as expressUtility from "../src/httpUtils/index.mjs" ;
import app from "../app.mjs" ;
import debug from "debug" ;
import http from "http" ;


debug( "rezbuild-capuchin:server" ) ;

/**
 * Get port from environment and store in Express.
 */
const port = expressUtility.normalizePort( process.env.PORT || "3000" ) ;
app.set( "port", port ) ;

/**
 * Create HTTP server.
 */
const server = http.createServer( app ) ;

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen( port ) ;
server.on( "error", expressUtility.errorHandler( port ) ) ;
server.on( "listening", expressUtility.listeningHandler( server ) ) ;
