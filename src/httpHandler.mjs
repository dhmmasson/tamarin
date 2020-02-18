import debug from "debug" ;

/**
 * Event listener for HTTP server "error" event.
 */
function errorHandler( port ) {
  return function onError( error ) {
    if ( error.syscall !== "listen" ) {
      throw error ;
    }
    const bind = typeof port === "string"
      ? "Pipe " + port
      : "Port " + port ;
    // handle specific listen errors with friendly messages
    switch ( error.code ) {
    case "EACCES":
      console.error( bind + " requires elevated privileges" ) ;
      throw error ;
    case "EADDRINUSE":
      console.error( bind + " is already in use" ) ;
      throw error ;
    default:
      throw error ;
    }
  } ;
}

/**
 * Event listener for HTTP server "listening" event.
 */
function listeningHandler( server ) {
  return function onListening() {
    const addr = server.address() ;
    const bind = typeof addr === "string"
      ? "pipe " + addr
      : "port " + addr.port ;
    debug( "Listening on " + bind ) ;
  } ;
}

export { errorHandler, listeningHandler } ;
