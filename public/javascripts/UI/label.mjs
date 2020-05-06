
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
    this.label = this.svg
      .text( criterion.description )
      .move( offset.x, offset.y )
      .fill( this.color ) ;
    this.ellipse = null ;
    this.callback = callback ;
    this.label.mousedown( event => { this.onMousedown( event ) ; } ) ;
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
        .on( "dragmove.namespace", () => this.onDrag( ) ) ;
      this.ellipse.fill( this.color ) ;
      // forward the event to the elipse
      this.ellipse.remember( "_draggable" ).startDrag( event ) ;
    }
  }

  onDrag() {
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
    //
    console.log( this ) ;
    this.weightOverlay
      .move( lerp( x, x1, 0.8 ), y )
      .text( "Importance: " + this.criterion.weight ) ;
    this.granularityOverlay
      .move( lerp( x1, x2, 0.8 ), lerp( y, y2, 0.7 ) )
      .text( "Granularity: " + prettyPrintPercent( this.criterion.blurIntensity ) ) ;
  }
}


const lerp = ( a, b, t ) => a * ( 1 - t ) + b * t ;
const prettyPrintPercent = x => `${ Math.round( x * 100 ) }%` ;
export { Label } ;
