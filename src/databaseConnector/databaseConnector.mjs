/* eslint newline-per-chained-call: ["error", { "ignoreChainWithDepth": 2 }]*/
/**
 * @file databaseConnector - Create the connexion to the sql database and provide the accessors. load queries from sql files
 * @author dhmmasson <@dhmmasson>
 */

import * as models from "../../public/javascripts/Models/index.mjs" ;
import { basename, dirname, join, resolve } from "path" ;
import { fileURLToPath } from "url" ;
import { promises as fs } from "fs" ;
import mysql from "mysql2" ;

const __dirname = dirname( fileURLToPath( import.meta.url ) ) ;

/** @typedef {string} Query - a string representing a mysql Query **/

/**
 *
 * @class
 * @memberof! module:ExpressUtils
 */
class Connector {

  /**
   * constructor - create a databaseConnector to get informations
   *
   * @param  {Object} _configuration Accept all mysql2 options + a path for the sql queries folder, the following are set by default.
   * @param  {Object} _configuration.host Set by default to the env variable     mysqlHost
   * @param  {Object} _configuration.user Set by default to the env variable     mysqlUser
   * @param  {Object} _configuration.password Set by default to the env variable mysqlPassword
   * @param  {Object} _configuration.database Set by default to the env variable mysqlDatabase
   * @param  {Object} _configuration.sqlPath  Path to the sql folder containing the request.
   * @return {module:ExpressUtils.Connector}                description
   */
  constructor( _configuration ) {
    const defaultConfiguration =
    { host     : process.env.mysqlHost
    , user     : process.env.mysqlUser
    , password : process.env.mysqlPassword
    , database : process.env.mysqlDatabase
    , sqlPath  : join( __dirname, "sql" )
    } ;
    const configuration = Object.assign( defaultConfiguration, _configuration ) ;

    /** @property {Object.<string,Query> } sqlRoot - root folder for the sql files  */
    this.sqlRoot = resolve( process.env.PWD, configuration.sqlPath ) ;

    /** @property {external:MySql2.pool} pool - internal pool to query the db */
    this.pool = mysql.createPool( configuration ).promise() ;

    /** @property {Object.<string,Query> } sql - queries map */
    this.sql = {} ;

    this.importSql() ;
  }


  /**
   * importSql - Read the files in the this.sqlRoot folder, populate this.sql with
   *
   * @return {type}  description
   */
  importSql( ) {
    fs.readdir( this.sqlRoot )
      .then( files => {
        return Promise.all(
          files.map( file => {
            return fs.readFile( resolve( this.sqlRoot, file ), "utf8" )
              .then( data => Promise.resolve( [ file, data ] ) ) ;
          } ) ) ;
      } )
      .then( allSql => {
        allSql.forEach( ( [ filename, query ] ) => {
          this.sql[ basename( filename, ".sql" ) ] = query ;
        } ) ;
      } )
      .catch( console.warn ) ;
  }

  /**
  * Connector#getCriterion -  return all the criteria in the database
  *
  * @return {Promise<module:models.Criterion[]>}  Promise to deliver the criteria from the database
  */
  getCriteria() {
    return this.pool.query( this.sql.criteria_get_all )
      .then( cleanCriterion ) ;
  }


  /**
   * Connector:getTechnologies - return all evaluated technologies
   *
   * @return {Promise<module:models.Technology[]>}  Promise to deliver the evaluated technologies from the database
   * @todo join with technology table to gather the description
   */
  getTechnologies() {
    // TODO: join with technology table to gather the description
    return this.pool.query( this.sql.data_get_all )
      .then( pivotEvaluation ) ;
  }
}

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


export default function() { return new Connector() ; }
