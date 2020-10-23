 import { Criterion } from "./models/Criterion.mjs" ;
 
 /**
   * constructor - create a new criterion from a serialization of it (either from json or from the db)
   *
   * @param  {number} 	 - new value depending on the changed type
   * @param  {Object} 	 - date 
   * @param  {string}    - name of the criteria
   * @param  {string}    - type of the change (blurIntensity or weight)
   */
class Log{
	constructor( criterion, type ){
		if (type === Criterion.eventType.weightUpdated){
			this.newValue = criterion.weight;
		}
		if (type === Criterion.eventType.blurIntensityUpdated){
			this.newValue = criterion.blurIntensity;
		}
		this.time= new Date();
		this.criterion=criterion;
		this.type=type;
	}
}

export { Log };