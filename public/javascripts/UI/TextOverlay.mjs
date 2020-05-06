

/**
 * @property {Svg.js~Container} svg
 * @property {string} color  color of the background of the label
 * @property {number} border border size in px
 *
 * @todo: add foreground and background color
 */
export default class TextOverlay {

  /**
   * constructor - Create a new text overlay
   *
   * @param  {type} container where to put the overlay - they should all be in the same container
   * @param  {type} backgroundColor  color of the background
   * @param  {type} textColor  text color
   * @return {type}           description
   */

  constructor( container, backgroundColor, textColor = "#FFF" ) {
    this.svg = container ;
    this.color = backgroundColor ;
    this.border = 2 ;
    // Save coordinate for resizing purposes
    this._x = 0 ;
    this._y = 0 ;
    this._hidden = false ;
    this.group = this.svg.group() ;
    this.group.front().mouseover( () => this.group.front() ) ;
    this.textElement = this.group
      .text( "a" )
      .stroke( textColor )
      .font( { size: 12 } )
      .font( { anchor: "middle" } ) ;

    this.rect = this.group
      .rect( this.textElement.length() + this.border * 2, 12 + this.border * 2 )
      .radius( 3 )
      .fill( this.color )
      .stroke( this.color )
      .back() ;

    this.recenter() ;
  }

  set hidden( value ) {
    this._hidden = value ;
    if( value ) this.group.hide() ;
    else this.group.show() ;
  }

  hide( ) { this.hidden = true ; return this ; }

  show( ) { this.hidden = false ; return this ; }

  mousedown( callback ) {
    this.group.mousedown( event => { callback( event ) ; } ) ;
    return this ;
  }

  /**
   * move - Move the element to the given center coordinate, push back to top
   *
   * @param  {number} x new center coordinate
   * @param  {number} y new center coordinate
   * @return {TextOverlay}      itself
   */
  move( x, y ) {
    // Save them for resize/recenter
    this._x = x ;
    this._y = y ;
    this.group.center( x, y ) ;
    // Push back to top
    this.top() ;
    return this ;
  }


  /**
   * recenter - resize rectangle and recenter text
   *
   * @return {TextOverlay}      itself
   */
  recenter( ) {
    this.rect
      .size( this.textElement.length() + this.border * 2
        , 12 + this.border * 2 ) ;
    this.textElement.center( this._x,
      this._y ) ;
    //  this.move( this._x, this._y ) ;
    return this ;
  }

  /**
   * text - update the text displayed
   *
   * @param  {string} text text to display
   * @return {TextOverlay}      itself
   */
  text( text ) {
    this.textElement.text( `${ text }` ) ;
    this.recenter() ;
    return this ;
  }


  /**
   * top - push the element to the Top so that it overlay the line
   *
   * @return {TextOverlay}      itself
   */
  top( ) {
    this.rect.front() ;
    this.textElement.front() ;
    this.group.front() ;
    return this ;
  }
}
