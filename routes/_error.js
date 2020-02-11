const createError = require( "http-errors" ) ;

/**
 * handle404 - catch 404 and forward to error handler
 *
 * @param  {Express~Request} req  the HTTP request
 * @param  {Express~Response} res  the HTTP response
 * @param  {Express~callback} next the next handler to call
 */
function handle404 ( req, res ) {
  console.log( "Handle404" ) ;
  errorHandler( createError( 404 ), req, res ) ;
}


/**
 * errorHandler - The actual handler
 * provides a message the error to error.pug
 *
 * @param  {type} err the error
 * @param  {Express~Request} req  the HTTP request
 * @param  {Express~Response} res  the HTTP response
 */
function errorHandler( err, req, res ) {
  console.log( "errorHandler", err ) ;
  // set locals, only providing error in development
  res.locals.message = err.message ;
  res.locals.error = req.app.get( "env" ) === "development" ? err : {} ;
  // render the error page
  res.status( err.status || 500 ) ;
  res.render( "error" ) ;
}

module.exports =
{ handle404    : handle404
, errorHandler : errorHandler
} ;
