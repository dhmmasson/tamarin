
/**
 * @module models
 * @file models.js - Contains all the different models needed for the sorting algorithm
 * @author dhmmasson
 */
export { Criteria, Technology } ;

/**
* @class Criteria
* @property {string} name - Unique name of the criteria, to use to reference the criteria
* @property {string} description - Full name to be used to be displayed
* @property {Score} min - Minimum value for the criteria in the database
* @property {Score} max - Maximum value for the criteria in the database
*/
function Criteria( { name, description, min, max } ) {
  this.name = name ;
  this.description = description ;
  this.min = +min ;
  this.max = +max ;
}

/** @typedef {number} Score - number between 0 - 5 */

/**
* @class Evaluation
* @property {string} technology - Name of the technology
* @property {string} criteria -  name of the criteria
* @property {Score} value - evaluation for the couple `technology` - `criteria`
*/

/**
* @class Technology
* @property {string} technology - Unique name of the technology, to use to reference the criteria
* @property {string} description - Full name to be used to be displayed
* @property {Object.<Criteria~name,Evaluation~value>} evaluations - Minimum value for the criteria in the database
*/
function Technology( { technology, decription, evaluations } ) {
  this.name = technology ;
  // TODO: Change so that description is taken into account
  this.description = decription || technology ;
  this.evaluations = evaluations || {} ;
}

// TODO: learn how to correctly have a file for server and client
