
/**
 * @module models
 * @file models.js - Contains all the different models needed for the sorting algorithm
 * @author dhmmasson
 */
import { Criterion } from "./models/Criterion.mjs" ;
import { Technology } from "./models/Technology.mjs" ;
export { Criterion, Technology } ;

/** @typedef {number} Score - number between 0 - 5 */

/**
* @class Evaluation
* @property {string} technology - Name of the technology
* @property {string} criteria -  name of the criteria
* @property {Score} value - evaluation for the couple `technology` - `criteria`
*/
