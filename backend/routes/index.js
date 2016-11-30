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
  db.reset()
    .then( () => {
      response.json(null)
    })
    .catch( error => {
      response.status(500).json({ error })
    })
})

module.exports = router;
