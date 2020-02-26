/* eslint new-cap: ["error", { "capIsNewExceptions": ["SVG"] }]*/

import * as SVGmodule from "../svg.esm.js" ;
import { Label } from "./label.mjs" ;
import { map, round } from "../utils.mjs" ;
window.SVG = SVGmodule ;


/**
 * @property {Object} dimensions
 * * @property {number} dimensions.width    full width of the svg area
 * * @property {number} dimensions.height   full height of the svg area
 * @property {number} restAreaWidth         width in px of the rest area for the interactor
 * @property {BBOX} stageBox
 * @property {Svg.js~Container} labelArea
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
   */
  constructor( root, criteria ) {
    this.dimensions = (
      { width  : "100%"
      , height : "300px" } ) ;
    this.restAreaWidth = 100 ;

    this._initSvg( root, this.dimensions ).then(
      () => this._setupCriteria( criteria )
        ._setupStage()
    ) ;

  }


  /**
   * async _initSvg - load the svg.draggable.js module and set up the svg
   * @param {htmlNode} root
   * @param {Object} size
   * @param {number} size.width
   * @param {number} size.height
   * @return {UI} this
   */
  _initSvg( root, size ) {
    window.SVG = SVGmodule ;
    return import( "../svg.draggable.js" )
      .then( () => {
        // delete window.SVG ;
        this.svg = SVGmodule.SVG().addTo( root ).size( size.width, size.height ) ;
        const rect = this.svg.rect( "100%", "100%" ) ;
        this.dimensions = rect.bbox() ;
        rect.remove() ;
        return this ;
      } ) ;

  }


  /**
   * _setupStage - set the label area, the interacting area etc..
   *
   * @return {UI} this
   */
  _setupStage() {
    const labelBox = this.labelArea.bbox() ;

    labelBox.w += 2 * labelBox.x + 50 ;
    labelBox.x2 += 2 * labelBox.x + 50 ;


    this.stageBox = this.dimensions ;
    // Move left border ( and adapt width dx = x - x2)
    this.stageBox.w += this.stageBox.x ;
    this.stageBox.x = labelBox.x2 ;
    this.stageBox.w -= labelBox.x2 ;
    // move up border
    this.stageBox.h += this.stageBox.y ;
    this.stageBox.y = labelBox.y2 ;
    this.stageBox.h -= labelBox.y2 ;

    this.labelArea
      .rect( labelBox.w, "100%" )
      .addClass( "labelArea" )
      .back() ;

    this.svg
      .line( this.stageBox.x
        , this.stageBox.y
        , this.stageBox.x
        , this.stageBox.y2 )
      .stroke( { width : 1
      , color : "red" } ) ;
    this.mapWeight = map( this.stageBox.x, this.stageBox.w, 0, 10 ) ;
    this.mapBlur = map( this.stageBox.y, this.stageBox.h, 0, 1 ) ;
    return this ;
  }


  /**
   * _setupCriteria - set up the label in the area
   *
   * @param  {module:Models~Criterion[]} criteria description
   * @return {UI}          this
   */
  _setupCriteria( criteria ) {
    this.labelArea = this.svg.group() ;

    this.labels = [] ;
    let i = 0 ;
    for( const criterion of criteria ) {
      this.labels.push(
        new Label( this.labelArea
          , { i : i
          , x : 5
          , y : 15 * ++i }
          , criterion
          , label => {

            label.criterion.weight = round( this.mapWeight( label.ellipse.cx() ), 2 ) ;
            label.criterion.blurIntensity = Math.max( 0, round( this.mapBlur( label.ellipse.cy() ), 2 ) ) ;

          } ) ) ;
    }
    return this ;
  }
}

export { UI } ;
