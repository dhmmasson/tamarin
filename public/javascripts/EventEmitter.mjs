/**
 * @file event firing class
 * @author dhmmasson <@dhmmasson>
 */

class EventEmitter {

  /**
   * Constructor - Create an new event firer
   *
   * @param  {string[]} [eventType] list of possible events, serve no purpose for now
   */
  constructor( eventType ) {
    this.eventType = eventType ;
    this.handlers = [] ;
  }

  /**
   * fire - call the callback relative to the event
   *
   * @param  {EventEmitter.eventType} eventName name of the event to fire
   */
  fire( eventName ) {
    if( Object.hasOwnProperty.call( this.handlers, eventName ) ) {
      if( typeof this.handlers[ eventName ] === "function" ) {
        this.handlers[ eventName ]( eventName, this ) ;
        return this ;
      } else if ( this.handlers[ eventName ] instanceof Array ) {
        let fired = false ;
        for( const handler of this.handlers[ eventName ] ) {

          if( typeof handler === "function" ) {
            fired = true ;
            handler( eventName, this ) ;
          }
        }
        if( fired ) return this ;
      }
    }

    return this ;
  }

  /**
   * on - add event listener
   *
   * @param  {EventEmitter.eventType} eventName event to subscribe to
   * @param  {EventEmitter.callback}  callback callback
   * @param  {object}  [_this] object to bind the callback
   * TODO check for duplicate
   */
  on( eventName, callback, _this ) {
    if( typeof callback !== "function" ) return ;
    if( typeof this.handlers[ eventName ] === "function" ) {
      this.handlers[ eventName ] = [ this.handlers[ eventName ], callback.bind( _this ) ] ;
    } else if ( this.handlers[ eventName ] instanceof Array ) {
      this.handlers[ eventName ].push( callback.bind( _this ) ) ;
    } else {
      this.handlers[ eventName ] = callback.bind( _this ) ;
    }
  }
}

/**
 * list of possible event that an eventFirer can fire
 * @enum {string}
 * @readonly
 */
EventEmitter.eventType = {} ;

export { EventEmitter } ;
