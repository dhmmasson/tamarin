/**
 * @file httpHandler - A set of utility function for the express server
 * @author dhmmasson
 */

/**
  * Express Error Callback
  *
  * @callback onError
  * @param {external:Express.Error} error
  * @throws {EACCES|EADDRINUSE}
  * @memberof! module:HttpUtils
  */

/**
 * generate an event listener capable of printing the port
 * @param  {(string|number)} port name of the pipe or port number
 * @return {module:ExpressUtility.onError}      Event listener for HTTP server "error" event.
 * @memberof! module:HttpUtils
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

export { errorHandler } ;
