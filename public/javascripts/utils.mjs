
/**
 * @file a set of utils function
 * @author dhmmasson
 */


/**
 * definePrivateProperties - automatically define private **(non enumerable)** properties
 *
 * @param  {object} object   the object for which you want to define private properties
 * @param  {string} ...names as many private fields as you want to define
 * @return {object}          the `object`
 */
export function definePrivateProperties( object, ...names ) {
  for( const name of names ) {
    Object.defineProperty( object, name,
      { enumerable : false
      , writable   : true } ) ;
  }
  return object ;
}


/**
 * round - description
 *
 * @param  {number} number    description
 * @param  {number} precision description
 * @return {type}           description
 */
export function round( number, precision ) {
  function shift( number, exponent ) {
    const numArray = ( "" + number ).split( "e" ) ;
    return +( numArray[ 0 ] + "e" + ( numArray[ 1 ] ? ( +numArray[ 1 ] + exponent ) : exponent ) ) ;
  }
  return shift( Math.round( shift( number, +precision ) ), -precision ) ;
}


/**
 * map - description
 *
 * @param  {number} sourceMin            description
 * @param  {number} sourceRange          description
 * @param  {number} destinationMin = 0   description
 * @param  {number} destinationRange = 1 description
 * @return {type}                      description
 */
export function map( sourceMin, sourceRange, destinationMin = 0, destinationRange = 1 ) {
  return x => destinationMin + destinationRange * ( x - sourceMin ) / sourceRange ;
}

/**
 * map - description
 *
 * @param  {number} sourceMin            description
 * @param  {number} sourceRange          description
 * @param  {number} destinationMin = 0   description
 * @param  {number} destinationRange = 1 description
 * @return {type}                      description
 */
export function mapClamped( sourceMin, sourceRange, destinationMin = 0, destinationRange = 1 ) {
  return x => destinationMin + destinationRange * clamp( ( x - sourceMin ) / sourceRange ) ;
}
// Cute with all the arrows... ( num, min, max ) =>  num <= min ? min : num >= max ? max : num


export const clamp = ( num, min = 0, max = 1 ) => Math.max( min, Math.min( max, num ) ) ;

export const lerp = ( a, b, t ) => a * ( 1 - t ) + b * t ;

export const prettyPrintPercent = x => `${ Math.round( x * 100 ) }%` ;
