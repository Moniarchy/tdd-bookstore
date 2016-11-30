const express = require('express');
const router = express.Router();
const db = require('../../queries')
const func = require('./books')

router.get( '/', ( request, response, next ) => {
  response.render( 'index', { title: 'Express' });
});

router.get( '/ping', ( request, response, next ) => {
  response.send( 'pong')
})

//Resets database
router.post( '/test/reset-db', ( request, response ) => {
  db.reset()
    .then(() => { db.setup() })
    .then( () => { response.json(null) })
    .catch( error => { response.status(500).json({ error }) })
})


module.exports = router;
