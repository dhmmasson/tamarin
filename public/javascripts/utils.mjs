
/**
 * @file a set of utils function
 * @author dhmmasson
 */


/**
 * definePrivateProperties - automatically define private **(non enumerable)** properties
 *
 * @param  {object} object   the object for which you want to define private properties
 * @param  {string} ...names as many private fields as you want to define
 * @return {type}          the `object`
 */
export function definePrivateProperties( object, ...names ) {
  for( const name of names ) {
    Object.defineProperty( object, name,
      { enumerable : false
      , writable   : true } ) ;
  }
  return object ;
}
