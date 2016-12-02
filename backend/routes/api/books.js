const express = require('express');
const router = express.Router();
const { createBook } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')

//CreateBook
router.post( '/', ( request, response ) => {
  // First, create the book
  const { title, author, year, genres } = request.body

  if(request.body.hasOwnProperty(title)){
    db.createBook( request.body )
      .then( data => response.status( 201 ).json( data ) )
  }else{ response.body = { error:{ message: "title cannot be  blank" }}
    return response.status( 400 ).json( response.body ) }
})

module.exports = router
