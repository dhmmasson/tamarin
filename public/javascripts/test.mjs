import { Sorter } from "./sortingAlgorithm.mjs" ;
const sorter = new Sorter( [], [] ) ;
window.sorter = sorter ;

$.get( "/api/criteria", function( data ) {
  sorter.criteria = data.criteria ;

  test() ;
} ) ;

$.get( "/api/technologies", function( data ) {
  sorter.technologies = data.technologies ;
  test() ;
} ) ;

function test() {

  if( sorter.criteriaArray.length > 0 && sorter.technologiesArray.length > 0 ) {
    sorter.on( Sorter.eventType.sorted, printer ) ;
    sorter.criteriaArray[ 0 ].weight = 0 ;
    sorter.criteriaArray[ 1 ].weight = 3 ;

    sorter.criteriaArray[ 1 ].blurIntensity = 0 ;
    sorter.criteriaArray[ 1 ].blurIntensity = 0.1 ;
    sorter.criteriaArray[ 1 ].blurIntensity = 0.2 ;
  }
}

function round( number, precision ) {
  function shift( number, exponent ) {
    const numArray = ( "" + number ).split( "e" ) ;
    return +( numArray[ 0 ] + "e" + ( numArray[ 1 ] ? ( +numArray[ 1 ] + exponent ) : exponent ) ) ;
  }
  return shift( Math.round( shift( number, +precision ) ), -precision ) ;
}
function printer( eventType, sorter ) {
  const { criteriaArray:criteria, sortedTechnologies:technologies } = sorter ;
  const printableArray = [] ;
  for( const technology of technologies ) {
    const line = { name: technology.name } ;
    for( const criterion of criteria ) {
      if( criterion.weight > 0 ) {
        line[ criterion.name + "min" ] = round( technology.bounds[ criterion.name ], 2 ) ;
        line[ criterion.name + "max" ] = technology.evaluations[ criterion.name ] ;
        line[ criterion.name + "dom" ] = technology.dominance[ criterion.name ] ;
      }
    }
    line.score = technology.score ;
    printableArray.push( line ) ;
  }
  console.table( printableArray ) ;
}
