const express = require( "express" ) ;
const router = express.Router() ;


/**
 * router - handle the index path through index.pug
 *
 * @param  {type} "/"     the mount point
 */
router.get( "/", function( req, res ) {
  res.render( "index" ) ;
} ) ;

module.exports = router ;
