
/**
 * @file Contains all the different Models needed for the sorting algorithm
 * @author dhmmasson <@dhmmasson>
 * @module Models
 */

import { Criterion } from "./Criterion.mjs" ;
import { Technology } from "./Technology.mjs" ;

/**
* @typedef {number} Score - number between 0 - 5
* @memberof! Models
*/

/**
* @class
* @name module:Models.Evaluation
* @property {string} technology - Name of the technology
* @property {string} criteria -  name of the criteria
* @property {Score} value - evaluation for the couple `technology` - `criteria`
*/

export { Criterion, Technology } ;
