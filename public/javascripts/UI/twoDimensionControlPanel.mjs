/* eslint new-cap: ["error", { "capIsNewExceptions": ["SVG"] }]*/

import * as SVGmodule from "../svg.esm.js";
import { draggable } from "../svg.draggable.js";

import { map, mapClamped } from "../utils.mjs";
import { Label } from "./label.mjs";

window.SVG = SVGmodule;

/**
 * @property {Object} dimensions
 * * @property {number} dimensions.width    full width of the svg area
 * * @property {number} dimensions.height   full height of the svg area
 * @property {number} restAreaWidth         width in px of the rest area for the interactor
 * @property {BBOX} stageBox
 * @property {Svg.js~Container} labelsGroup
 * @property {Svg.js~Container} svg
 * @property {function} mapWeight  convert coordinate to weight
 * @property {function} mapBlur    convert coordinate to blurIntensity
 * @property {} labels
 */
class UI {
  /**
   * constructor - create the twoDimensionControlPanel
   *
   * @param  {htmlNode} root     description
   * @param  {module:Models~Criterion[]} criteria description
   * @param  {Function} callback called when setting up is done
   */
  constructor(root, criteria, callback) {
    this.dimensions = { width: "100%", height: "500px" };
    this.restAreaWidth = 100;

    this._initSvg(root, this.dimensions).then(() => {
      this._setupCriteria(criteria)._setupStage();
      if (typeof callback === "function") return callback();
      return null;
    });
  }

  /**
   * async _initSvg - load the svg.draggable.js module and set up the svg
   * @param {htmlNode} root
   * @param {Object} size
   * @param {number} size.width
   * @param {number} size.height
   * @return {UI} this
   */
  _initSvg(root, size) {
    window.SVG = SVGmodule;
    // delay loading of svg.draggable.js
    draggable(window.SVG);
    return Promise.resolve().then(() => {
      // delete window.SVG ;
      this.svg = SVGmodule.SVG().addTo(root).size(size.width, size.height);
      const rect = this.svg.rect("100%", "100%");
      this.dimensions = rect.bbox();
      rect.remove();
      const reload = () => {
        const rect = this.svg.rect("100%", "100%");
        this.dimensions = rect.bbox();
        rect.remove();
        this._cleanUpStage()._setupStage();
      };
      window.addEventListener("resize", reload);
      $(".tabs").tabs({ onShow: reload });

      return this;
    });
  }

  /**
   * _setupStage - set the label area, the interacting area etc..
   *
   * @return {UI} this
   */
  _setupStage() {
    const offset = 5;
    const { x, y, w, h } = this.labelsGroup.bbox();
    const { x2, y2 } = this.dimensions;

    this.labelBox = new SVG.Box(x - offset, y, w + 2 * offset, h);
    this.stageBox = new SVG.Box(
      this.labelBox.x2,
      this.labelBox.y2,
      x2 - this.labelBox.x2,
      y2 - this.labelBox.y2
    );

    this.areas = {};
    // Draw label area
    this.areas.labels = this.labelsGroup
      .rect(this.labelBox.w, "100%")
      .move(this.labelBox.x, this.labelBox.y)
      .addClass("labelsGroup")
      .back();

    // Draw stage area
    this.areas.stage = this.svg
      .rect(this.stageBox.w, this.stageBox.h)
      .move(this.stageBox.x, this.stageBox.y)
      .fill("#eee")
      .back();

    this.areas.axis = this.svg.group();
    const text = this.areas.axis
      .text("Importance")
      .fill("#bbb")
      .addClass("dropshadow")
      .font({ anchor: "left", size: 20 });
    text.move(this.stageBox.x2 - text.length() - 2, this.stageBox.y);
    this.areas.axis
      .textPath("Granularity")
      .fill("#bbb")
      .addClass("dropshadow")
      .font({ anchor: "left", size: 20 })
      .plot(
        `M ${this.stageBox.x - 10} ${this.stageBox.y2 - 2} L ${
          this.stageBox.x - 10
        } ${this.stageBox.y + 10}`
      );

    const title = this.areas.axis
      .text("<- Drag criteria from the left to start ordering technologies")
      .fill("#bbb")
      .font({ anchor: "left", size: 20 });
    title.move(
      this.stageBox.x + this.stageBox.w / 2 - title.length() / 2,
      this.labelBox.h / 2
    );
    // Generate mapping function
    this.mapWeight = map(this.stageBox.x, this.stageBox.w, 0, 10);
    this.mapBlur = mapClamped(this.stageBox.y, this.stageBox.h, 0, 0.2);

    this.inverseMapWeight = map(0, 10, this.stageBox.x, this.stageBox.w);
    this.inversemapBlur = map(0, 0.2, this.stageBox.y, this.stageBox.h);

    for (const label of this.labels) {
      label.stageBox = this.stageBox;
      label.updatePosition();
    }

    return this;
  }

  _cleanUpStage() {
    this.areas.labels.remove();
    this.areas.stage.remove();
    this.areas.axis.remove();
    return this;
  }

  /**
   * _setupCriteria - set up the label in the area
   *
   * @param  {module:Models~Criterion[]} criteria description
   * @return {UI}          this
   */
  _setupCriteria(criteria) {
    this.labelsGroup = this.svg.group();

    this.labels = [];
    let i = 0;
    for (const criterion of criteria) {
      this.labels.push(
        new Label(this, { i: i, x: 5, y: 15 * ++i }, criterion, (label) => {})
      );
    }
    return this;
  }
}

export { UI };
