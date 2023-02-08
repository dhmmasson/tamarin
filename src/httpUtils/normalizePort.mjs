/**
 * @file normalizePort
 * @author dhmmasson
 */

/**
 * normalizePort - Normalize a port into a number, string, or false.
 * @param  {(string|number)} value either pipe name or port number
 * @return {(string|number|false)}  the name of the pipe or the port number or false
 * @memberof! module:HttpUtils
 */
function normalizePort(value) {
  const port = parseInt(value, 10);
  if (isNaN(port)) {
    // named pipe
    return value;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

export { normalizePort };
