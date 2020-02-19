/**
 * @file httpHandler - A set of utility function for the express server
 * @author dhmmasson
 */


import debug from "debug" ;

/**
 * listening Callback
 * @callback onListening
 * @memberof! module:HttpUtils
 */

/**
  * listeningHandler - return an Event listener for HTTP server "listening" event.
  * @param  {@external:Express.Server} server an express server associated with the listening
  * @return {module:ExpressUtility.onListening} an onlistening calback that print the port number or pipe name
  * @memberof! module:HttpUtils
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

export { listeningHandler } ;
