import { lerp, prettyPrintPercent } from "../utils.mjs" ;
import TextOverlay from "./TextOverlay.mjs" ;
import { round } from "../utils.mjs" ;

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
   * @param  {SVGjs~Element} container in which labelsGroup element should the Label be included
   * @param  {Object} offset
   * * @param  {Object} offset.i index
   * * @param  {Object} offset.x x coordinate for the label
   * * @param  {Object} offset.y y coordinate for the label
   * @param  {module:Models~Criterion} criterion description
   */
  constructor( twoDimensionControlPanel, offset, criterion, callback ) {
    this.panel = twoDimensionControlPanel ;
    this.criterion = criterion ;

    this.color = colors[ offset.i % colors.length ] ;
    criterion.color = this.color ;
    this.offset = offset ;
    this.labelsGroup = twoDimensionControlPanel.labelsGroup.group() ;
    this.slidersGroup = twoDimensionControlPanel.svg.group() ;

    this.weight = 0 ;
    this.blurIntensity = 0 ;

    this.constraints = null ;
    this.ellipse = null ;
    this.callback = callback ;

    this.label = this.labelsGroup
      .text( criterion.description )
      .move( offset.x, offset.y )
      .fill( this.color )
      .mousedown( event => { this.onMousedown( event ) ; } ) ;

    this.labelBbox = this.label.bbox() ;
    this.LineOrigin = { x : this.labelBbox.x2
    , y : this.labelBbox.cy } ;
    if( this.criterion.weight > 0 ) {
      this.createHandle( 0, 0 ) ;
    }
    criterion.on( "updated",
      () => {
        if( ( this.weight !== this.criterion.weight ) || ( this.blurIntensity !== this.criterion.blurIntensity ) ) {
          this.createHandle( 0, 0 ) ;
          this.updatePosition() ;
        }
      }
    ) ;


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
      this.createHandle( event.offsetX, event.offsetY ) ;
    }
    this.ellipse.remember( "_draggable" ).startDrag( event ) ;
  }


  onDrag( e ) {
    const{ x, y } = constrain( this.constraints, e ) ;
    this.moveHandle( x, y ) ;
  }

  updatePosition( ) {
    if( this.criterion.weight > 0 ) {
      this.weight = this.criterion.weight ;
      this.blurIntensity = this.criterion.blurIntensity ;

      const x = this.panel.inverseMapWeight( this.criterion.weight ) ;
      const y = this.panel.inversemapBlur( this.criterion.blurIntensity ) ;
      this.moveHandle( x, y ) ;
    }
  }

  moveHandle( cx, cy ) {
    // Move ellipse
    this.ellipse.center( cx, cy ) ;
    // 45º angle
    const x1 = cx - Math.abs( cy - this.LineOrigin.y ) ;

    this.line.plot( [ this.LineOrigin.x, this.LineOrigin.y
      , x1, this.LineOrigin.y
      , cx, cy
      , x1, this.LineOrigin.y ] ) // Backtrace to prevent batwing effect
      .back() ;

    this.weightLine.plot( [ x1, this.LineOrigin.y, cx, this.LineOrigin.y, cx, this.LineOrigin.y - 4, cx, this.LineOrigin.y + 4, cx, this.LineOrigin.y ] ) ;

    // Update weight
    this.weight = round( this.panel.mapWeight( cx ), 2 ) ;
    this.criterion.weight = this.weight ;
    this.weightOverlay
      .move( lerp( this.LineOrigin.x, x1, 1 ), this.LineOrigin.y )
      .text( "Importance: " + this.criterion.weight )
      .hidden = !( this.criterion.weight > 0 ) ;

    // Update Blur
    this.blurIntensity = Math.max( 0, round( this.panel.mapBlur( cy ), 2 ) ) ;
    this.criterion.blurIntensity = this.blurIntensity ;
    this.granularityOverlay
      .move( lerp( x1, x2, 0.75 ), lerp( y, y2, 0.7 ) )
      .text( `Granularity: ${ prettyPrintPercent( this.criterion.blurIntensity ) } - ${ this.criterion.classCount } classes` )
      .hidden = !( this.criterion.blurIntensity > 0 ) ;

    this.callback( this ) ;
  }


  createHandle( targetX, targetY ) {
    const b = this.label.bbox() ;
    const x = b.x2
        , y = b.y + b.h / 2
        , x2 = 2.5 + targetX
        , y2 = 2.5 + targetY
        , x1 = x2 - Math.abs( y2 - y ) ;

    this.line = this.slidersGroup
      .polyline( [ this.LineOrigin.x, this.LineOrigin.y
        , x1, y
        , x2, y2
        , x1, y ] ) // Go back to prevent the bat wing effect
      .stroke( this.color )
      .back() ;

    this.weightLine = this.slidersGroup
      .polyline( [ x1, this.LineOrigin.y
        , x2, this.LineOrigin.y
        , x2, this.LineOrigin.y - 2
        , x2, this.LineOrigin.y + 2 ] ) // Go back to prevent the bat wing effect
      .stroke( this.color )
      .addClass( "dashed" )
      .back() ;

    this.ellipse = this.slidersGroup
      .ellipse()
      .fill( this.color )
      .draggable()
      .addClass( "bidirectionnel" )
      .move( 2.5 + targetX, 2.5 + targetY )
      .on( "dragmove.namespace", e => this.onDrag( e ) )
      // Managing axis constrained motion
      .on( "dragend.namespace", () => {

        this.constraints.axis = null ;
        this.callback( this ) ;
      } ) ;

    // Create overlay for weight
    this.weightOverlay =
      new TextOverlay( this.slidersGroup.parent(), this.color )
        .move( lerp( x, x1, 0.2 ), y )
        .hide()
        .addClass( "horizontal" )
        .mousedown( event => axisConstraint( this, "y", event ) ) ;
    // Create overlay for granularity
    this.granularityOverlay =
      new TextOverlay( this.slidersGroup.parent(), this.color )
        .hide()
        .addClass( "vertical" )
        .mousedown( event => axisConstraint( this, "x", event ) ) ;

  }
}

const axisConstraint = ( label, axis, event ) => {
  label.constraints.axis = axis ;
  label.constraints.constant = label.ellipse[ axis ]() ;
  label.ellipse.remember( "_draggable" ).startDrag( event ) ;
} ;


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
  if( constraints.axis === "y" ) y = constraints.constant ;
  if( constraints.axis === "x" ) x = constraints.constant ;
  return { x
  , y } ;

}
export { Label } ;
