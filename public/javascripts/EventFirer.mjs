/**
 * @file event firing class
 * @author dhmmasson <@dhmmasson>
 */

class EventFirer {
  constructor() {
    this.handlers = [] ;
  }

  /**
   * fire - call the callback relative to the event
   *
   * @param  {EventFirer.eventType} eventName name of the event to fire
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
   * @param  {EventFirer.eventType} eventName event to subscribe to
   * @param  {EventFirer.callback}  callback callback
   * TODO check for duplicate
   */
  on( eventName, callback, _this ) {
    if( typeof callback !== "function" ) console.warn( this, eventName, callback ) ;
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
 * EventFirer.eventType
 * @enum {string}
 * @readonly
 */
EventFirer.eventType = {} ;

export { EventFirer } ;
