const express = require('express');
const router = express.Router();
const { createBook, getBooks } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')
const BOOKS = require('../../test/books.json')

//CreateBook
router.post( '/', ( request, response ) => {
  // First, create the book
  const { title, author, year, genres } = request.body

  if(request.body.title){
    db.createBook( request.body )
      .then( data => { return response.status( 201 ).json( data )})
  }else{ response.body = { error:{ message: "title cannot be blank" }}
    return response.status( 400 ).json( response.body ) }
})

router.get( '/', ( request, response ) => {
  let page = parseInt( request.query.page, 10 ) || 1
    db.getBooks( page )
      .then( books => {
        console.log( 'This is what getBooks returns', books )

        return books
      })
      .then( data => { return response.status( 200 ).json( data ) })
      .catch(error => {
        console.log('im an error1!')
        response.render('error', {error})
      })
})

module.exports = router
