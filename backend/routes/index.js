const express = require('express');
const router = express.Router();
const db = require('../queries')

router.get( '/', ( request, response, next ) => {
response.render( 'index', { title: 'Express' });
});

router.get( '/ping', ( request, response, next ) => {
  response.send( 'pong')
})

router.post( '/api/test/reset-db', ( request, response ) => {
  db.resetDb()
  .then( response.status( 200 ))
  .catch( error => {
    response.render( 'error', { error })
  })
})

module.exports = router;
