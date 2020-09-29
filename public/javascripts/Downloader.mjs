
const formater = new Intl.DateTimeFormat( "en",
  { year   : "2-digit"
  , month  : "2-digit"
  , day    : "2-digit"
  , hour   : "2-digit"
  , minute : "2-digit"
  , second : "2-digit"
  } ) ;
const formatedDate = () => {
  const date = formater.formatToParts( new Date() ).reduce(
    ( acc, e ) => {
      acc[ e.type ] = e.value ;
      return acc ;
    }, {} ) ;
  return `${ date.year }${ date.month }${ date.day }_${ date.hour }${ date.minute }${ date.second }` ;
} ;
const paramExportCSV = {
quotes         : true // or array of booleans
, quoteChar      : "\""
, escapeChar     : "\""
, delimiter      : ","
, header         : true
, newline        : "\r\n"
, skipEmptyLines : true // or 'greedy',
, columns        : null // or array of strings
} ;

/**
 * @class
 */
export class Downloader {


  /**
   * constructor - description
   *
   * @param  {type} htmlElement htlmRoot element of the button, must contain an anchor element (<a>)
   * @return {type}             description
   */
  constructor( htmlElement ) {
    [ this.anchor ] = $( htmlElement ).find( "a" ) ;
    $( htmlElement ).click( event => {
      console.log( "click" ) ;
      this.saveData() ;
    } ) ;
    console.log( htmlElement, this.anchor ) ;
  }

  // Update the csv to be downloaded
  updateCSV( data ) {
    if( this.anchor.href ) window.URL.revokeObjectURL( this.anchor.href ) ;
    this.csv = Papa.unparse( { fields : [ "name", "description", "score" ]
    , data   : data.sorted }, paramExportCSV ) ;
    const blob = new Blob( [ this.csv ]
          , { type: "text/csv" } )
        , url = window.URL.createObjectURL( blob ) ;
    this.anchor.href = url ;
  }

  saveData() {
    this.anchor.download = `data_${ formatedDate() }.csv` ;
  }
}
