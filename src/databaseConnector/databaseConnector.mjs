/**
 * @file databaseConnector - Create the connexion to the sql database and provide the accessors. load queries from sql files
 * @author dhmmasson <@dhmmasson>
 * @memberof! module:ExpressUtils
 */

import * as models from "../../public/javascripts/models/index.mjs" ;
import { basename, dirname, join, resolve } from "path" ;
import { fileURLToPath } from "url" ;
import { promises as fs } from "fs" ;
import mysql from "mysql2" ;

const __dirname = dirname( fileURLToPath( import.meta.url ) ) ;

/** @typedef {string} Query - a string representing a mysql Query **/

/**
 * Connector to the database, read queries from sql files
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
    // delete sqlPath as mysql is strict on what should be in it options object
    delete configuration.sqlPath ;

    /** @property {external:MySql2.pool} pool - internal pool to query the db */
    this.pool = mysql.createPool( configuration ).promise() ;

    /** @property {Object.<string,Query> } sql - queries map */
    this.sql = {} ;

    this.importSql().then( console.log ) ;
  }


  /**
   * importSql - Read the files in the this.sqlRoot folder, populate this.sql with
   *
   * @return {Promise.<empty>} An empty promise... resolved when the sql map is filled
   */
  importSql( ) {

    const storeQuery = filename => query => { this.sql[ basename( filename, ".sql" ) ] = query ; }
        , getContent = filename => fs.readFile( resolve( this.sqlRoot, filename ), "utf8" )
        , readSqlFile = filename => getContent( filename ).then( storeQuery( filename ) )
        , readFiles = files => Promise.all( files.map( readSqlFile ) ) ;

    return fs.readdir( this.sqlRoot )
      .then( readFiles )
      .catch( console.warn ) ;
  }

  /**
  * Connector#getCriteria -  return all the criteria in the database
  *
  * @return {Promise.<Criterion[]>}  Promise to deliver all the {@link module:Models~Criterion} from the database
  */
  getCriteria() {
    return this.pool
      .query( this.sql.criteria_get_all )
      .then( cleanCriterion ) ;
  }


  /**
   * Connector:getTechnologies - return all evaluated technologies
   *
   * @return {Promise.<Technology[]>}  Promise to deliver the evaluated {@link module:Models~Technology} from the database
   * @todo join with technology table to gather the description
   */
  getTechnologies() {
    // TODO: join with technology table to gather the description
    return this.pool
      .query( this.sql.data_get_all )
      .then( pivotEvaluation ) ;
  }
}

/**
  * Connector~pivotEvaluation - Convert an array of evaluation into an array of evaluated technologies
  *
  * @param  {module:Models~Evaluation[]} evaluations array of evaluations
  * @return {Promise<module:Models~Technology[]>} Promise a array of evaluated technologies
  * @memberof! module:ExpressUtils~Connector
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
   * @param  {Array.<module:Models~Criterion>} rows an array where the first element is an array of criteria to clean
   * @return {Promise.<module:Models~Criterion[]>}          Cleaned Criterion
   * @memberof! module:ExpressUtils~Connector
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
