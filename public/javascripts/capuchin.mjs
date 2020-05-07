import { Sorter } from "./Sorter.mjs" ;
import { UI } from "./UI/twoDimensionControlPanel.mjs" ;
import { template } from "./template.mjs" ;
import * as SVGmodule from "./svg.esm.js" ;
window.SVG = SVGmodule ;
console.log( window.SVG
) ;
const sorter = new Sorter( [], [] ) ;
let ui = null ;
$( getCriteria() ) ;
function getCriteria( ) {
  $.get( "/api/criteria", function( data ) {
    sorter.criteria = data.criteria ;
    ui = new UI( $( "#controlPanel" )[ 0 ], sorter.criteria.all, () => initSorter() ) ;

  } ) ;
}


$.get( "/api/technologies", function( data ) {
  sorter.technologies = data.technologies ;
  initSorter() ;
} ) ;

function initSorter() {
  if( sorter.criteria.all.length > 0 && sorter.technologies.all.length > 0 ) {
    attachEventListener() ;
    loadState() ;
  }
}


function loadState( ) {
  sorter.criteria.all[ 0 ].weight = 1 ;
  sorter.criteria.all[ 0 ].blurIntensity = 0.1 ;
}

function attachEventListener () {
  sorter.on( Sorter.eventType.sorted, () => {

    $( "#result" ).empty().append( template.table(
      { technologies : sorter.technologies.sorted
      , criteria     : sorter.criteria.all } ) ) ;
  } ) ;
}

function loadControlPanel( mode ) {
  if( mode === "2Dimension" ) {
    load2DimensionControlPanel() ;
  }else {
    load2SliderControlPanel() ;
  }
}

function load2SliderControlPanel() {
  $( "#controlPanel" )
    .empty()
    .append( template.twoSliderControlPanel( { criteria: sorter.criteria.all } ) )
    .find( "input" )
    .change( function( e ) {
      const input = $( e.target )
          , criterionName = input.data( "criterion" )
          , parameter = input.data( "parameter" )
          , criterion = sorter.criteria.map[ criterionName ] ;
      criterion[ parameter ] = input.val() ;
    } ) ;
}
function load2DimensionControlPanel() {
  $( "#controlPanel" )
    .empty()
    .append( template.twoDimensionControlPanel( { criteria: sorter.criteria.all } ) )
    .find( ".draggable" )
    .each(

      /**
       * function - apply draggable
       * @this {Jquery~element} an .draggable element
       */
      function( ) {
        const label = ui.svg( this ) ;
        label.mousedown( function( event ) {
          const node = label.ellipse().draggable().move( 2.5 + event.offsetX, 2.5 + event.offsetY ) ;
          node.remember( "_draggable" ).startDrag( event ) ;
        } ) ;
      } ) ;
}
