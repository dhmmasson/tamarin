import { Technology } from "../models/Technology.mjs";
import * as SVGmodule from "../svg.esm.js";
import { centeredUnitRandom, clamp } from "../utils.mjs";

window.SVG = SVGmodule;
const modes = {
  dominance: "dominance",
  rank: "rank",
  centroid: "centroid",
};
class ParallelCoordinatesPlotPanel {
  constructor(root, criteria) {
    this.dimensions = {
      width: "100%",
      height: "300px",
    };
    this.mode = modes.dominance;
    this._initSvg(root, this.dimensions)._setupStage();
  }

  /**
   * update - update the parallel coordinates plot
   * @param {module:Models~Technology[]} technologies
   * @param {module:Models~Criterion[]} criteria
   * /
   * @memberof ParallelCoordinatesPlotPanel
   * */
  update(technologies, criteria) {
    this._cachedTechnologies = technologies;
    this._cachedCriteria = criteria;

    this._cleanUpStage()._setupStage(criteria);
    technologies.forEach((technology, index) =>
      this._drawTechnology(technology, criteria, index, technologies.length)
    );
  }

  /**
   * async _initSvg - load the svg.draggable.js module and set up the svg
   * @param {htmlNode} root
   * @param {Object} size
   * @param {number} size.width
   * @param {number} size.height
   * @return {ParallelCoordinatesPlotPanel} this
   * @private
   * @memberof UI
   *
   */
  _initSvg(root, size) {
    window.SVG = SVGmodule;
    this.svg = SVGmodule.SVG().addTo(root).size(size.width, size.height);
    this.paddingTop = 15;
    this._updateSize();

    window.addEventListener("resize", () => {
      this._updateSize();
      this._cleanUpStage()._setupStage();
    });

    return this;
  }

  _updateSize() {
    const rect = this.svg.rect("100%", "100%");
    this.dimensions = rect.bbox();
    this.dimensions.height -= this.paddingTop;
    rect.remove();
  }
  /**
   * _getAxisPosition - get the position of the axis for a given criteria
   * @param {number} index
   * @param {number} length
   * @return {number}
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   */
  _getAxisPosition(index, length) {
    return (this.dimensions.width / (length - 1)) * index;
  }

  /**
   * _setupStage - set up the stage for the parallel coordinates plot
   * @return {ParallelCoordinatesPlotPanel} this
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   */
  _setupStage(criteria) {
    this._drawStage(criteria);
    return this;
  }

  /**
   * _drawStage - draw the stage for the parallel coordinates plot
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   *  */
  _drawStage(criteria) {
    this.stage = this.svg.group();
    this.stage.attr({
      id: "stage",
    });

    this.stage.attr({
      "stroke-width": 1,
    });

    //add 10px padding to the top of the stage
    this.stage.translate(0, this.paddingTop);

    this._setupCriteria(criteria);
    this.technologyLabels = this.stage.group();
    // Add text for the mode of the plot
    this.modeText = this.stage.text(this.mode);
    this.modeText.attr({
      "font-size": 12,
      "font-family": "sans-serif",
      fill: "black",
      "text-anchor": "start",
    });

    this.modeText.move(10, -this.paddingTop);

    // Change mode on click
    this.modeText.on("click", () => {
      const modesArray = Object.values(modes);
      const index = modesArray.indexOf(this.mode);
      this.mode = modesArray[(index + 1) % modesArray.length];
      this.modeText.text(this.mode);
      this.update(this._cachedTechnologies, this._cachedCriteria);
    });
  }

  /**
   * _setupCriteria - set up the criteria, draw the axis and the labels for each criteria with weight
   * @param {module:Models~Criterion[]} criteria
   * @return {ParallelCoordinatesPlotPanel} this
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   */
  _setupCriteria(criteria) {
    this.criteria = criteria ?? this.criteria ?? [];
    this.axisLabels = this.stage.group();
    this.axisLabels.attr({
      id: "axisLabels",
    });
    this.criteria.forEach((criterion, index, activeCriteria) => {
      this._drawAxis(criterion, index, activeCriteria.length);
      this._drawLabel(criterion, index, activeCriteria.length);
    });
    return this;
  }

  /**
   * _drawAxis - draw the axis for a given criteria
   * @param {module:Models~Criterion} criterion
   * @param {number} index
   * @param {number} length
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   */
  _drawAxis(criterion, index, length) {
    const axis = this.axisLabels.line(0, 0, 0, this.dimensions.height);
    axis.attr({
      "stroke-width": 1,
      stroke: criterion.color,
    });
    axis.move(this._getAxisPosition(index, length), 0);
  }

  /**
   * _drawLabel - draw the label for a given criteria
   * @param {module:Models~Criterion} criterion
   * @param {number} index
   * @param {number} length
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   */
  _drawLabel(criterion, index, length) {
    const label = this.axisLabels.text(criterion.name);
    label.attr({
      "font-size": 12,
      "font-family": "sans-serif",
      fill: criterion.color,
      "text-anchor": "start",
    });

    label.move(this._getAxisPosition(index, length) + 5, -8);
    if (index === length - 1)
      label.move(this._getAxisPosition(index, length) + 5, 5);
    label.rotate(90, this._getAxisPosition(index, length) + 5, 0);
  }

  /**
   * _cleanUpStage - remove all the elements from the stage
   * @return {ParallelCoordinatesPlotPanel} this
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   * */
  _cleanUpStage() {
    this.stage.remove();
    this.axisLabels.remove();
    return this;
  }

  /**
   * _drawTechnology - draw a technology on the parallel coordinates plot
   * @param {module:Models~Technology} technology
   * @param {module:Models~Criterion[]} criteria
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   * */
  _drawTechnology(technology, criteria, index, length) {
    const activeCriteria = criteria.filter((c) => c._weight > 0);
    const points = activeCriteria.map((criterion, indexCriteria) => {
      return [
        this._getAxisPosition(indexCriteria, activeCriteria.length),
        this._getTechnologyPosition(
          technology,
          criterion,
          index,
          activeCriteria.length
        ),
      ];
    });
    const line = this.stage.polyline(points);
    this._colorTechnology(line, technology, index, length);
    line.on("click", () => {
      this._drawTechnologyLabels(technology, criteria);
      technology.selected = !technology.selected;
      criteria[0].update();
      this._colorTechnology(line, technology, index);
    });
  }

  _colorTechnology(line, technology, index, length) {
    //Color the line
    line.attr({
      fill: "none",
      stroke: technology.selected
        ? "rgb(0,255,0)"
        : mapIndexToColor(index, length),
      "stroke-width": technology.selected ? 5 : 2,
    });
  }

  /**
   * _getTechnologyPosition - get the position of a technology for a given criteria
   * @param {module:Models~Technology} technology
   * @param {module:Models~Criterion} criterion
   * @param {number} index
   * @param {number} length
   * @return {number}
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   * */
  _getTechnologyPosition(technology, criterion, index, length, mode = "rank") {
    const r = (centeredUnitRandom(index) * criterion.blurIntensity) / 8;
    const position = {
      rank: technology.rank[criterion.name] / (criterion.classCount - 1),
      dominance:
        technology.dominance[criterion.name] / (criterion.maxDominance - 1),
      centroid:
        criterion.classes[technology.dominance[criterion.name]].centroidNormal,
    };

    return this.dimensions.height * clamp(1 - position[this.mode] + r, 0, 1);
  }

  /**
   * _drawTechnologyLabels - draw the labels for a technology
   * @param {module:Models~Technology} technology
   * @param {module:Models~Criterion[]} criteria
   * @private
   * @memberof ParallelCoordinatesPlotPanel
   * */
  _drawTechnologyLabels(technology, criteria) {
    this.technologyLabels.clear();
    const activeCriteria = criteria.filter((c) => c._weight > 0);
    activeCriteria.forEach((criterion, index) => {
      const label = this.technologyLabels.text(
        `${criterion.name}: ${technology.dominance[criterion.name]}`
      );
      label.attr({
        "font-size": 12,
        "font-family": "sans-serif",
      });
      label.move(
        this._getAxisPosition(index, activeCriteria.length) + 5,
        this._getTechnologyPosition(
          technology,
          criterion,
          index,
          activeCriteria.length
        ) + 5
      );
    });
  }
}

function mapIndexToColor(index, length) {
  //lerp between red and blue
  const r = Math.floor((255 * index) / length);
  const b = Math.floor((255 * (length - index)) / length);
  return `rgba(${r}, 0, ${b}, 0.5)`;
}

export { ParallelCoordinatesPlotPanel };
