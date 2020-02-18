/**
 * @module models
 * @file Technology.js - This file is part of the models module, it describes the Technology class
 * @author dhmmasson
 */

/**
* @class Technology
* @property {string} name - Unique name of the technology, to use to reference the criteria
* @property {string} description - Full name to be used to be displayed
* @property {Object.<Criterion~name,Evaluation~value>} evaluations - actual evaluation of the technology for the criteria
* @property {Object.<Criterion~name,Evaluation~value>} bounds - blurred value for the criteria
*/
class Technology {
  constructor ( { technology, name, decription, evaluations } ) {
    this.name = technology || name ;
    // TODO: Change so that description is taken into account
    this.description = decription || technology ;
    this.evaluations = evaluations || {} ;
    this.bounds = {} ;
    this.dominance = {} ;
    this.score = 0 ;
  }

  /**
   * updateBounds - update the bounds for the given criteria
   *
   * @param  {Criterion[]} criteria
   * @return {this}        return this
   */
  updateBounds( criteria ) {
    for( const criterion of criteria ) {
      this.bounds[ criterion.name ] = criterion.blur( this.evaluations[ criterion.name ] ) ;
      this.dominance[ criterion.name ] = 0 ;
    }
    return this ;
  }


  /**
   * updateDominance - compute how many other technology are dominated (i.e this lower bound is greater than their evaluation)
   *
   * @param  {Criterion[]} criteria     updated criteria ( or all )
   * @param  {Technology[]} technologies all technologies to compare to
   * @return {Technology}              this
   */
  updateDominance( criteria, technologies ) {
    for( const criterion of criteria ) {
      this.dominance[ criterion.name ] = 0 ;
      for( const technology of technologies ) {
        if( technology !== this ) {
          // this dominate technology
          if( this.bounds[ criterion.name ] > technology.evaluations[ criterion.name ] ) this.dominance[ criterion.name ]++ ;
        }
      }
    }
    return this ;
  }


  /**
   * updateScore - weight sum of the dominance
   *
   * @param  {Object.<string, Criterion>} criteria map of all criteria
   * @return {Technology}          this
   */
  updateScore( criteria ) {
    this.score = 0 ;
    for( const criterionName in this.dominance ) {
      this.score += criteria[ criterionName ].weight * this.dominance[ criterionName ] ;
    }
    return this ;
  }
}

export { Technology } ;
