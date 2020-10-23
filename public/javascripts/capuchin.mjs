/**
 * @file the main functions
 * @author dhmmasson
 */

import { Sorter } from "./Sorter.mjs" ;
import { Criterion } from "./models/Criterion.mjs" ;
import { UI } from "./UI/twoDimensionControlPanel.mjs" ;
import { template } from "./template.mjs" ;
import { Downloader } from "./Downloader.mjs" ;
import * as SVGmodule from "./svg.esm.js" ;
import { Logs } from "./Logs.mjs" ;
window.SVG = SVGmodule ;
const sorter = new Sorter( [], [] ) ;
let ui = null ;


$( loadData() ) ;

/**
   * loadData - load criteria and technologies
   *
   * @param  {function} call function getCriteria
   * @param  {function} call function getTechnologies
   */

function loadData( ) {
  getCriteria() ;
  getTechnologies() ;
}

/**
   * getCriteria - get criteria from db to sorter
   *
   * @param  
   */
function getCriteria( ) {
  $.get( "/api/criteria", function( data ) {
    sorter.criteria = data.criteria ;
    ui = new UI( $( "#controlPanel" )[ 0 ], sorter.criteria.all, () => initSorter() ) ;
  } ) ;
}

/**
   * getTechnologies - get technologies from db to sorter then call sorter function
   *
   * @param  
   */
function getTechnologies( ) {
  $.get( "/api/technologies", function( data ) {
    sorter.technologies = data.technologies ;
    initSorter() ;
  } ) ;
}

/**
   * initSorter - initialize the the window for the first time 
   *
   * @param {boolean} activate only once the function initSorter  
   */
let onlyOnce = true ;
let logs = null ;
function initSorter() {
  if( sorter.criteria.all.length > 0 && sorter.technologies.all.length > 0 && onlyOnce ) {
    logs = new Logs() ; 
	loadState() ;
	attachEventListener() ;
    
    onlyOnce = false ;
    $( "#controlPanel" ).mouseup( () => { setTimeout( updateTable, 100 ) ; } ) ;
  }
}

/**
   * loadState - if there is nothing in the localStorage, only one criteria will be displayed. Otherwise, it will display what's in the localStorage
   *
   * @param  
   */
function loadState( ) {
	if (localStorage.getItem("sorterCriteria") === null) {
		sorter.criteria.all[ 0 ].weight = 1 ;
		console.log( "NothingInLocalStorage" ) ;
	} 
	else {  
		let criteria = JSON.parse(localStorage.getItem("sorterCriteria"));
		
		for (var i = 0; i < criteria.length; i++) {
			let criterion = criteria[i] ;
			console.log( criterion )
			sorter.criteria.map[ criterion.name ].weight = criterion.weight;
			sorter.criteria.map[ criterion.name ].blurIntensity = criterion.blurIntensity;
		}
		
	console.log( "SomethingInLocalStorage" ) ;
	}		
} 
 

/**
   * saveToLocalStorage - add name, blur and weight to localStorage
   *
   * @param {function} get name, blur and weight from export in Criterion.mjs if weight > 0
   * @param {function} convert name, blur and weight into string
   * @param {function} add this date to localStorage 
   */
function saveToLocalStorage ()  {
	localStorage.setItem("sorterCriteria", JSON.stringify(sorter.criteria.all.filter(e=>e.weight > 0).map( e=> e.export())));       
}

/**
   * attachEventListener - for each event, a sorting is done, saved to localStorage and create csv with technologies
   *
   * @param  
   */
function attachEventListener () {
  console.log( "attachEventListener" ) ;
  const downloader = new Downloader( $( "#saveButton" )[ 0 ] ) ;
  
  for (var i = 0; i < sorter.criteria.all.length; i++) {
		let criterion = sorter.criteria.all[i] ;
		criterion.on ( Criterion.eventType.blurIntensityUpdated, (t,c)=>logs.updateData(c,t) );
		criterion.on ( Criterion.eventType.weightUpdated, (t,c)=>logs.updateData(c,t));
	 	
	}
  
	sorter.on( Sorter.eventType.sorted, (sorted) => {
    updateTable( 10 ) ;	 
	saveToLocalStorage();
    downloader.updateCSV( sorter.technologies ) ;
	} ) ;
}

/**
   * updateTable - 
   *
   * @param  
   */
function updateTable( longueur ) {
  longueur = longueur ? longueur : sorter.technologies.sorted.length ;
  $( "#result" ).empty().append( template.table(
	  { technologies : sorter.technologies.sorted.slice( 0, longueur )
	  , criteria     : sorter.criteria.all } ) ) ;
}

/**
   * loadControlPanel - creates a 2D control panel & 2 sliders
   *
   * @param {string}    choose mode
   */
function loadControlPanel( mode ) {
  if( mode === "2Dimension" ) {
    load2DimensionControlPanel() ;
  }else {
    load2SliderControlPanel() ;
  }
}

/**
   * load2SliderControlPanel - 
   *
   * @param  
   */
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

/**
   * load2DimensionControlPanel - 
   *
   * @param  
   */
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
