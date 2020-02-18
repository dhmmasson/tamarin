
/**
 * @file sortingAlgorithm - sort technologies following a set of criteria
 * @author dhmmasson <@dhmmasson>
 */
import * as models from "./models.mjs" ;
import { EventFirer } from "./EventFirer.mjs" ;

/**
  * Sorter - the sortingAlgorithm wrapper class
  *
  * @class
  */
class Sorter extends EventFirer {

  /**
   * constructor - description
   *
   * @param  {module:models.Technology[]} technologies description
   * @param  {module:models.Criterion[]} criteria   description
   */
  constructor( technologies, criteria ) {
    super() ;

    /** @property {module:models.Technology[]} - Array form of all the technologies to be sorted */
    this.technologiesArray = [] ;

    /** @property {module:models.Technology[]} - Array of the technologies sorted */
    this.sortedTechnologies = [] ;

    /** @property {Object.<string,module:models.Technology>} - Map of all the technologies to be sorted, call the setter*/
    this.technologies = technologies ;


    /** @property {module:models.Criterion[]} - Array of all criterai*/
    this.criteriaArray = [] ;

    /** @property {Object.<string,module:models.Criterion>} - When a criterion has been updated in the UI add it to this array remove them when sort is complete */
    this.updatedCriteria = [] ;

    /** @property {Object.<string,module:models.Criterion>} - Map of all criterai*/
    this.criteria = criteria ;

    /** @property {Object.<Sorter~eventType, (callback|callbacks[])}  */
    this.handlers = {} ;

  }


  /**
   * set technologies - initialize the technology map, reset the sorted arrays
   *
   * @param  {module:models.Technology[]} technologies json serialized technology array
   */
  set technologies ( technologies ) {
    this._technologies = {} ;
    this.sortedTechnologies = [] ;
    this.technologiesArray = [] ;
    // Recreate object from the json serialization
    for( const technology of technologies ) {
      this._technologies[ technology.name ] = new models.Technology( technology ) ;
      this.technologiesArray.push( this.technologies[ technology.name ] ) ;
    }
  }

  get technologies( ) {
    return this._technologies ;
  }

  /**
   * set criteria - initialize the criteria map, reset the values
   *
   * @param  {module:models.Criterion[]} Criterion description
   */
  set criteria ( criteria ) {
    this._criteria = {} ;
    this.criteriaArray = [] ;
    // Recreate object from the json serialization
    for( const _criterion of criteria ) {
      const criterion = new models.Criterion( _criterion ) ;
      this.criteria[ criterion.name ] = criterion ;
      this.criteriaArray.push( criterion ) ;
      // watch for update
      criterion.on( models.Criterion.eventType.updated
        , ( eventName, criterion ) => {
          this.updatedCriteria.push( criterion ) ;
          this.sort() ;
        }, this ) ;
    }
    // Clone the criteria as all should be updated
    this.updatedCriteria = this.criteriaArray.slice() ;
  }

  get criteria( ) {
    return this._criteria ;
  }


  /**
   * sort - sort all technologies,
   *
   * @return {Sorter}  this
   */
  sort( ) {

    this.updateBounds().updateDominance().updateScore() ;
    // Clone technologies array and sort through score
    this.sortedTechnologies = this.technologiesArray.slice().sort( ( a, b ) => b.score - a.score ) ;
    this.updatedCriteria = [] ;
    this.fire( Sorter.eventType.sorted ) ;
    return this ;
  }


  updateDominance( ) {
    this.technologiesArray.forEach( e => e.updateDominance( this.updatedCriteria, this.technologiesArray ) ) ;
    return this ;
  }


  /**
   * updateBounds - refresh technology bounds for the updated criteria
   *
   * @return {Sorter}  this sorter
   */
  updateBounds( ) {
    this.technologiesArray.forEach( e => e.updateBounds( this.updatedCriteria ) ) ;
    return this ;
  }

  updateScore( ) {
    this.technologiesArray.forEach( e => e.updateScore( this.criteria ) ) ;
    return this ;
  }


}

/**
 * Sorter.eventType
 * @enum {string}
 * @readonly
 */
Sorter.eventType =
{ "sorted": "sorted" } ;

export { Sorter } ;
