import { lerp, prettyPrintPercent } from "../utils.mjs" ;
import TextOverlay from "./TextOverlay.mjs" ;

/**
 * @enum list of possible colors
 */
const colors = [ "#332288"
  , "#117733"
  , "#44AA99"
  , "#88CCEE"
  , "#DDCC77"
  , "#CC6677"
  , "#AA4499"
  , "#882255"
] ;

class Label {

  /**
   * constructor - create a new label that is interactive
   *
   * @param  {SVGjs~Element} container in which svg element should the Label be included
   * @param  {Object} offset
   * * @param  {Object} offset.i index
   * * @param  {Object} offset.x x coordinate for the label
   * * @param  {Object} offset.y y coordinate for the label
   * @param  {module:Models~Criterion} criterion description
   */
  constructor( container, offset, criterion, callback ) {
    this.criterion = criterion ;
    this.color = colors[ offset.i % colors.length ] ;
    this.offset = offset ;
    this.svg = container.group() ;
    window.ele = container ;


    this.constraints = null ;

    this.ellipse = null ;
    this.callback = callback ;

    this.label = this.svg
      .text( criterion.description )
      .move( offset.x, offset.y )
      .fill( this.color )
      .mousedown( event => { this.onMousedown( event ) ; } ) ;

    this.weightOverlay = null ;

  }

  // add offset
  set stageBox( box ) {
    const { x2, y2 } = box ;
    const x = Math.max( 0, this.label.bbox().x2 - 10 ) ;
    const y = Math.max( 0, this.label.bbox().y - 10 ) ;
    this.constraints = new SVG.Box( x, y, x2 - x + 10, y2 - y + 10 ) ;
  }

  /**
   * onMousedown - On clicking over the label create an elipse and start dragging it
   * if the ellipse exist don't create it.
   *
   * @param  {type} event description
   * @return {type}       description
   */
  onMousedown( event ) {
    if( this.ellipse === null ) {
      const b = this.label.bbox() ;
      const x = b.x2
          , y = b.y + b.h / 2
          , x2 = 2.5 + event.offsetX
          , y2 = 2.5 + event.offsetY
          , x1 = x2 - Math.abs( y2 - y ) ;

      this.line = this.svg
        .polyline( [ x, y
          , x1, y
          , x2, y2
          , x1, y ] ) // Go back to prevent the bat wing effect
        .fill( this.color )
        .stroke( this.color )
        .back() ;

      this.ellipse = this.svg
        .ellipse()
        .draggable()
        .move( 2.5 + event.offsetX, 2.5 + event.offsetY )
        .on( "dragmove.namespace", e => this.onDrag( e ) ) ;
      this.ellipse.fill( this.color ) ;
      // forward the event to the elipse

      this.weightOverlay =
      new TextOverlay( this.svg.parent(), this.color )
        .move( lerp( x, x1, 0.8 ), y )
        .hide()
        .mousedown( event => { this.ellipse.remember( "_draggable" ).startDrag( event ) ; } ) ;
      this.granularityOverlay =
      new TextOverlay( this.svg.parent(), this.color )
        .hide()
        .mousedown( event => { this.ellipse.remember( "_draggable" ).startDrag( event ) ; } ) ;
      this.ellipse.remember( "_draggable" ).startDrag( event ) ;
    }
  }

  onDrag( e ) {
    constrain( this.constraints, e ) ;
    const b = this.label.bbox() ;
    const x = b.x2
        , y = b.y + b.h / 2
        , x2 = this.ellipse.cx()
        , y2 = this.ellipse.cy()
        , x1 = x2 - Math.abs( y2 - y ) ;

    this.line.plot( [ x, y
      , x1, y
      , x2, y2
      , x1, y ] )
      .back() ;
    this.callback( this ) ;
    // Need to be after the callback : it sets/scale the weight
    this.weightOverlay
      .move( lerp( x, x1, 1 ), y - 6 )
      .text( "Importance: " + this.criterion.weight )
      .hidden = !( this.criterion.weight > 0 ) ;
    this.granularityOverlay
      .move( lerp( x1, x2, 0.75 ), lerp( y, y2, 0.7 ) )
      .text( "Granularity: " + prettyPrintPercent( this.criterion.classCount / 12 ) ) ;
    this.granularityOverlay.hidden = !( this.criterion.blurIntensity > 0 ) ;
  }
}

function constrain( constraints, e ) {
  const { handler, box } = e.detail ;

  e.preventDefault() ;
  let { x, y } = box ;
  // In case your dragged element is a nested element,
  // you are better off using the rbox() instead of bbox()

  if ( x < constraints.x ) {
    x = constraints.x ;
  }

  if ( y < constraints.y ) {
    y = constraints.y ;
  }

  if ( box.x2 > constraints.x2 ) {
    x = constraints.x2 - box.w ;
  }

  if ( box.y2 > constraints.y2 ) {
    y = constraints.y2 - box.h ;
  }
  handler.move( x, y ) ;

}
export { Label } ;
