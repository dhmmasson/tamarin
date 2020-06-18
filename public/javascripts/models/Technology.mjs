/**
 * @module Models
 * @file Technology.js - This file is part of the Models module, it describes the Technology class
 * @author dhmmasson
 */

/**
* @property {string} name - Unique name of the technology, to use to reference the criteria
* @property {string} description - Full name to be used to be displayed
* @property {Object.<Criterion~name,Evaluation~value>} evaluations - actual evaluation of the technology for the criteria
* @property {Object.<Criterion~name,Evaluation~value>} bounds - blurred value for the criteria
* @property {Object.<Criterion~name,number>} dominance - How many technologies are dominated ( value  >  bounds )
* @property {number} score - computed score : weighted sum.

* @todo Change everything to have a it in a one read ( compare this techno to an reduced array of technologies )
* @memberof! Models
* @alias module:Models~Technology
*/
class Technology {

  /**
   * constructor - construct a new Technology object from a serialization (json or the db)
   *
   * @param  {Object} serialization
   * @param  {string} [serialization.technology]         - name of the technology or `serialization.name` if not present
   * @param  {string} [serialization.name]               - name of the technology
   * @param  {string} [serialization.description]                      - description of the technology
   * @param  {Object.<string, module:Models~Score>} serialization.evaluations - key are part {@link module:Models~Criterion} evaluations
   */
  constructor ( { technology, name, description, evaluations } ) {
    this.name = technology || name ;
    // TODO: Change so that description is taken into account
    this.description = description || technology ;
    this.evaluations = evaluations || {} ;
    this.bounds = {} ;
    this.dominance = {} ;
	this.sortingorder = {} ;
    this.score = 0 ;
  }

  /**
   * updateBounds - update the bounds for the given criteria
   *
   * @param  {module:Models~Criterion[]} criteria
   * @return {module:Models~Technology}        return this
   */
  updateBounds( criteria ) {
    for( const criterion of criteria ) {
      this.bounds[ criterion.name ] = criterion.blur( this.evaluations[ criterion.name ] ) ;
      this.dominance[ criterion.name ] = 0 ;
		console.log(this.sortingorder[criterion.name]);
    }
    return this ;
  }


  /**
   * updateDominance - compute how many other technology are dominated (i.e this lower bound is greater than their evaluation)
   *
   * @param  {module:Models~Criterion[]} criteria     updated criteria ( or all )
   * @param  {module:Models~Technology[]} technologies all technologies to compare to
   * @return {module:Models~Technology}              this
   */
  updateDominance( criteria, technologies ) {
    for( const criterion of criteria ) {
    this.dominance[ criterion.name ] = 0 ;
    for( const technology of technologies ) {
		if( technology !== this ) {			
          // this dominate technology / ascending
			if (this.sortingorder [criterion.name] == 'ascending') {		  
				if( this.bounds[ criterion.name ] > technology.evaluations[ criterion.name ] ) this.dominance[ criterion.name ]++ ;
			}
			if (this.sortingorder [criterion.name] == 'descending') {		  
				if( this.bounds[ criterion.name ] < technology.evaluations[ criterion.name ] ) this.dominance[ criterion.name ]++ ;
			}
		}
	}	
	}
    return this ;
}



  /**
   * updateScore - weight sum of the dominance
   *
   * @param  {module:Models~Criterion[]} criteria Array of all criteria
   * @return {module:Models~Technology}          this
   * @todo should normalize dominance to rank
   */
  updateScore( criteria ) {
    this.score = 0 ;
    let normalization = 0 ;
    for( const criterion of criteria ) {
      this.score += criterion.weight * this.dominance[ criterion.name ] / criterion.maxDominance ;
      normalization += criterion.weight ;
    }
    this.score /= normalization ;
    return this ;
  }
}

export { Technology } ;
