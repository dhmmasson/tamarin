/**
 * @file databaseConnector - Create the connexion to the sql database and provide the accessors
 * @author dhmmasson <@dhmmasson>
 */

import * as models from "../../public/javascripts/Models/index.mjs" ;
import mysql from "mysql2" ;


/**
 * @class
 * @memberof! module:ExpressUtils
 */
function Connector() {
  const configuration =
    { host     : process.env.mysqlHost
    , user     : process.env.mysqlUser
    , password : process.env.mysqlPassword
    , database : process.env.mysqlDatabase
    } ;
  // Internal pool to connect to the database
  const pool = mysql.createPool( configuration ).promise() ;


  /**
  * Connector#getCriterion -  return all the criteria in the database
  *
  * @return {Promise<module:models.Criterion[]>}  Promise to deliver the criteria from the database
  */
  this.getCriteria = function() {
    return pool.query(
      `SELECT criteria.name, min( data.value ) as min, max( data.value ) as max
  FROM criteria
  LEFT JOIN data on data.criteria_name = criteria.name
  GROUP BY criteria.name` )
      .then( cleanCriterion ) ;
  } ;


  /**
   * Connector:getTechnologies - return all evaluated technologies
   *
   * @return {Promise<module:models.Technology[]>}  Promise to deliver the evaluated technologies from the database
   * @todo join with technology table to gather the description
   */
  this.getTechnologies = function() {
    // TODO: join with technology table to gather the description
    return pool.query( "select technology_name as technology, criteria_name as criteria, value from data" )
      .then( pivotEvaluation ) ;
  } ;

  /**
  * Connector~pivotEvaluation - Convert an array of evaluation into an array of evaluated technologies
  *
  * @param  {module:models.Evaluation[]} evaluations array of evaluations
  * @return {Promise<module:models.Technology[]>} Promise a array of evaluated technologies
  */
  function pivotEvaluation( [ evaluations ] ) {

    /** @type Object.<String,Technology> */
    const technologiesMap = {} ;

    /** @type Technology[] */
    const technologiesArray = [] ;
    for( const evaluation of evaluations ) {

      /** @type Technology */
      let technology = technologiesMap[ evaluation.technology ] ;
      // Create technology if not already in the array
      if( technology === undefined ) {
        technology = new models.Technology( evaluation ) ;
        technologiesMap[ evaluation.technology ] = technology ;
        technologiesArray.push( technology ) ;
      }
      technology.evaluations[ evaluation.criteria ] = +evaluation.value ;
    }
    return Promise.resolve( technologiesArray ) ;
  }


  /**
   * cleanCriterion - Clean criteria from the database request ( mainly clean the min and max values to be integer)
   *
   * @param  {Array.<module:models.Criterion>} rows an array where the first element is an array of criteria to clean
   * @return {Promise.<module:models.Criterion[]>}          Cleaned Criterion
   */
  function cleanCriterion( [ rows ] ) {

    /** @type Criterion[] */
    const criterias = [] ;
    for( const row of rows ) {
      criterias.push( new models.Criterion( row ) ) ;
    }
    return Promise.resolve( criterias ) ;
  }
}

export default function() { return new Connector() ; }
