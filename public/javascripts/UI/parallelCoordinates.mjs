import { Technology } from "../models/Technology.mjs";
import * as SVGmodule from "../svg.esm.js";

window.SVG = SVGmodule;

class ParallelCoordinatesPlotPanel {
    constructor(root, criteria) {
        this.dimensions = (
            {
                width: "100%"
                , height: "150px"
            });

        this._initSvg(root, this.dimensions)
            ._setupStage();
    }

    /**
     * update - update the parallel coordinates plot
     * @param {module:Models~Technology[]} technologies
     * @param {module:Models~Criterion[]} criteria
     * /
     * @memberof ParallelCoordinatesPlotPanel
     * */
    update(technologies, criteria) {
        this._cleanUpStage()._setupStage(criteria);
        technologies.forEach((technology, index) => this._drawTechnology(technology, criteria, index, technologies.length));
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
        const rect = this.svg.rect("100%", "100%");
        this.dimensions = rect.bbox();
        rect.remove();

        window.addEventListener("resize", () => {
            const rect = this.svg.rect("100%", "100%");
            this.dimensions = rect.bbox();
            rect.remove();
            this._cleanUpStage()._setupStage();
        });

        return this;
    };



    /**
     * _getAxisPosition - get the position of the axis for a given criteria
     * @param {number} index
     * @param {number} length
     * @return {number}
     * @private
     * @memberof ParallelCoordinatesPlotPanel
     */
    _getAxisPosition(index, length) {
        return this.dimensions.width / (length - 1) * (index);
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
            "id": "stage"
        });
        this.stage.attr({
            'stroke-width': 1,
            stroke: 'black'
        });
        this.stage.move(0, 0);
        this._setupCriteria(criteria);
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
        this.axisLabels = this.svg.group();
        this.axisLabels.attr({
            "id": "axisLabels"
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
            'stroke-width': 1,
            stroke: criterion.color
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
            'font-size': 12,
            'font-family': 'sans-serif',
            'fill': criterion.color,
            'text-anchor': 'start'

        });


        label.move(this._getAxisPosition(index, length) + 5, -8);
        if (index === length - 1) label.move(this._getAxisPosition(index, length) + 5, 5);
        label.rotate(90, this._getAxisPosition(index, length) + 5, 0)

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
        const activeCriteria = criteria.filter(c => c._weight > 0)
        const points = activeCriteria.map((criterion, index) => {
            return [
                this._getAxisPosition(index, activeCriteria.length),
                this._getTechnologyPosition(technology, criterion, index, activeCriteria.length)
            ];
        });
        const line = this.stage.polyline(points);
        //Color the line
        line.attr({
            fill: 'none',
            stroke: mapIndexToColor(index, length),
            'stroke-width': 2
        });
        line.on('click', () => {
            this._drawTechnologyLabels(technology, criteria);
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
    _getTechnologyPosition(technology, criterion, index, length) {
        return this.dimensions.height * technology.dominance[criterion.name] / criterion.maxDominance;
    }

    /**
     * _drawTechnologyLabels - draw the labels for a technology
     * @param {module:Models~Technology} technology
     * @param {module:Models~Criterion[]} criteria
     * @private
     * @memberof ParallelCoordinatesPlotPanel
     * */
    _drawTechnologyLabels(technology, criteria) {
        this.axisLabels.clear();
        const activeCriteria = criteria.filter(c => c._weight > 0)
        activeCriteria.forEach((criterion, index) => {
            const label = this.axisLabels.text(`${criterion.name}: ${technology.dominance[criterion.name]}`);
            label.attr({
                'font-size': 12,
                'font-family': 'sans-serif'
            });
            label.move(this._getAxisPosition(index, activeCriteria.length) + 5, this._getTechnologyPosition(technology, criterion, index, activeCriteria.length) + 5);
        });
    }

}

function mapIndexToColor(index, length) {
    //lerp between red and blue
    const r = Math.floor(255 * index / length);
    const b = Math.floor(255 * (length - index) / length);
    return `rgba(${r}, 0, ${b}, 0.5)`;
}


export { ParallelCoordinatesPlotPanel };