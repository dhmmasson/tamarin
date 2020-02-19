const express = require( "express" ) ;
const router = express.Router() ;

router.get( "/criteria", function( req, res, next ) {
  req.app.get( "connector" )
    .getCriteria()
    .then( criteria => res.json( { criteria: criteria } ) )
    .catch( err => next( err, req, res ) ) ;
} ) ;

router.get( "/technologies", function( req, res, next ) {
  req.app.get( "connector" )
    .getTechnologies()
    .then( techonologies => res.json( { technologies: techonologies } ) )
    .catch( err => next( err, req, res ) ) ;
} ) ;

router.use( handleError ) ;

function handleError( err, req, res ) {
  res.statusCode( 500 ) ;
  res.json( { error: err } ) ;
}

module.exports = router ;
