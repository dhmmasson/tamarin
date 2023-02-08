import { Downloader } from "./Downloader.mjs";
import { Log } from "./Log.mjs";

/**
 * constructor - create a new log
 *
 * @param  {array} -
 */
class Logs {
  constructor() {
    this.data = [];
  }
  /**
   * updateData - When a data is updated, the changes are added to data.
   *
   * @param  type     type of the change (blurIntensity or weight)
   * @param  criteria name of the criteria changed
   */
  updateData(criteria, type) {
    this.data.push(new Log(criteria, type));
  }
}

export { Logs };
