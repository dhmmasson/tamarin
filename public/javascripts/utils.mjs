
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
export function definePrivateProperties(object, ...names) {
  for (const name of names) {
    Object.defineProperty(object, name,
      {
        enumerable: false
        , writable: true
      });
  }
  return object;
}


/**
 * round - description
 *
 * @param  {number} number    description
 * @param  {number} precision description
 * @return {type}           description
 */
export function round(number, precision) {
  function shift(number, exponent) {
    const numArray = ("" + number).split("e");
    return +(numArray[0] + "e" + (numArray[1] ? (+numArray[1] + exponent) : exponent));
  }
  return shift(Math.round(shift(number, +precision)), -precision);
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
export function map(sourceMin, sourceRange, destinationMin = 0, destinationRange = 1) {
  return x => destinationMin + destinationRange * (x - sourceMin) / sourceRange;
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
export function mapClamped(sourceMin, sourceRange, destinationMin = 0, destinationRange = 1) {
  return x => destinationMin + destinationRange * clamp((x - sourceMin) / sourceRange);
}
// Cute with all the arrows... ( num, min, max ) =>  num <= min ? min : num >= max ? max : num


export const clamp = (num, min = 0, max = 1) => Math.max(min, Math.min(max, num));

export const lerp = (a, b, t) => a * (1 - t) + b * t;

export const prettyPrintPercent = x => `${Math.round(x * 100)}%`;

// From https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function mulberry32(a) {
  return function () {
    var t = a += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
export const seedRandom = t => mulberry32(t || t + 1)()
export const centeredUnitRandom = (seed) => 2 * (seedRandom(seed) - 0.5);