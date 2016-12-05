const express = require('express');
const router = express.Router();
const { createBook, getBooks, showAuthors } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')
const BOOKS = require('../../test/books.json')


router.get( '/', ( request, response ) => {
  let page = parseInt( request.query.page, 10 ) || 1
  db.showAuthors( page )
    .then( data => {
      return response.status( 200 ).json( data ) })
    .catch(error => {
      // console.log('im an error1!')
      console.log( error )
      response.render('error', {error})
    })

})


module.exports = router
