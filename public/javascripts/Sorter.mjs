/**
 * @file sortingAlgorithm - sort technologies following a set of criteria
 * @author dhmmasson <@dhmmasson>
 */
import * as Models from "./models/index.mjs";
import { EventEmitter } from "./EventEmitter.mjs";
import { definePrivateProperties } from "./utils.mjs";

/**
 * Sorter - the sortingAlgorithm wrapper class
 *
 * @class
 * @extends EventEmitter
 */
class Sorter extends EventEmitter {
  /**
   * constructor - initialize everything
   *
   * @param  {module:Models~Technology[]} [technologies] description
   * @param  {module:Models~Criterion[]} [criteria]   description
   */
  constructor(technologies, criteria) {
    super();

    /** @property {Object} technologies - all the technologies
     * @property {module:Models~Technology[]} technologies.all Array of all the technologies
     * @property {Object} technologies.sorted Array of all the technologies sorted by latest computed score
     * @property {Object} technologies.map ap of all the technologies to be sorted, call the setter
     * */
    this.technologies = technologies;

    /** @property {Object} criteria - all the criteria
     * @property {module:Models~Criterion[]} criteria.all Array of all the criteria
     * @property {module:Models~Criterion[]} criteria.updated Array of all the criteria that have been recently updated
     * @property {Object.<string, module:Models~Criterion[]>} criteria.map Array of all the criteria that have been recently updated
     */
    this.criteria = criteria;

    definePrivateProperties(this, "_technologies", "_criteria");
  }

  /**
   * set technologies - initialize the technology map, reset the sorted arrays
   *
   * @param  {module:Models~Technology[]} technologies json serialized technology array
   */
  set technologies(technologies) {
    this._technologies = { all: [], sorted: [], map: {} };
    // Recreate object from the json serialization
    for (const serialization of technologies) {
      /** @type module:Models~Technology */
      const technology = new Models.Technology(serialization);
      this._technologies.all.push(technology);
      this._technologies.map[technology.name] = technology;
    }
  }

  /**
   * get technologies - return the object _technologies
   *
   * @return {type}  description
   */
  get technologies() {
    return this._technologies;
  }

  /**
   * set criteria - initialize the criteria map, reset the values
   *
   * @param  {module:Models~Criterion[]} Criterion description
   */
  set criteria(criteria) {
    this._criteria = { all: [], map: {}, updated: [] };
    // Recreate object from the json serialization
    for (const _criterion of criteria) {
      const criterion = new Models.Criterion(_criterion);
      this._criteria.map[criterion.name] = criterion;
      this._criteria.all.push(criterion);
      // watch for update
      criterion.on(
        Models.Criterion.eventType.updated,
        (eventName, criterion) => {
          this._criteria.updated.push(criterion);
          this.sort();
        },
        this
      );
    }
    // Clone the criteria as all should be updated
    this._criteria.updated = this._criteria.all.slice();
  }

  /**
   * get criteria - description
   *
   * @return {type}  description
   */
  get criteria() {
    return this._criteria;
  }

  /**
   * sort - sort all technologies. UpdateBounds > UpdateDominance > UpdateScore then sort.
   * Clear updatedCriteria.
   * fire event:Sorter.eventType.sorted
   *
   * @return {Sorter}  this
   */
  sort() {
    this.updateBounds().updateDominance().normalizeDominance().updateScore();
    // Clone technologies array and sort through score
    this.technologies.sorted = this.technologies.all
      .slice()
      .sort((a, b) => b.score - a.score);
    this.criteria.updated = [];
    this.fire(Sorter.eventType.sorted);
    return this;
  }

  /**
   * updateDominance - refresh all dominance
   *
   * @return {Sorter}  this
   */
  updateDominance() {
    this.technologies.all.forEach((e) =>
      e.updateDominance(this.criteria.updated, this.technologies.all)
    );
    return this;
  }

  /**
   * updateBounds - refresh technology bounds for the updated criteria
   *
   * @return {Sorter}  this sorter
   */
  updateBounds() {
    this.technologies.all.forEach((e) => e.updateBounds(this.criteria.updated));
    return this;
  }

  /**
   * normalizeDominance - normalize dominance
   *
   * @return {Sorter}  this
   */
  normalizeDominance() {
    for (const criterion of this.criteria.all) {
      criterion.maxDominance = this.technologies.all.reduce(
        (acc, technologie) =>
          Math.max(acc, technologie.dominance[criterion.name]),
        0
      );
      const classes = [
        ...new Set(
          this.technologies.all.map(
            (technologie) => +technologie.dominance[criterion.name]
          )
        ),
      ].sort((a, b) => a - b);

      classes.forEach((dominance, rank) => {
        const techs = this.technologies.all.filter(
          (t) => t.dominance[criterion.name] === dominance
        );
        criterion.classes[dominance] = {
          dominance: dominance,
          rank: rank,
          centroid:
            techs.reduce((acc, t) => acc + t.evaluations[criterion.name], 0) /
            techs.length,
          centroidNormal:
            techs.reduce((acc, t) => acc + t.evaluations[criterion.name], 0) /
            techs.length /
            criterion.max,
          count: techs.length,
        };
      });

      criterion.classCount = classes.length;
      this.technologies.all.forEach(
        (t) =>
          (t.rank[criterion.name] = classes.indexOf(
            t.dominance[criterion.name]
          ))
      );
    }

    return this;
  }

  /**
   * updateScore - refresh the score of all technologies
   *
   * @return {Sorter}  this
   */
  updateScore() {
    this.technologies.all.forEach((e) => e.updateScore(this.criteria.all));
    return this;
  }
}

/**
 * Sorter.eventType
 * @enum {string}
 * @readonly
 */
Sorter.eventType = { sorted: "sorted" };

export { Sorter };
