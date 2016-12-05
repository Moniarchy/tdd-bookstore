const express = require('express');
const router = express.Router();
const { createBook, getBooks, showAuthors, retrieveBooksByAuthor } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')
const BOOKS = require('../../test/books.json')

router.post( '/', ( request, response ) => {
  const { title, author, year, genres } = request.body

  if( request.body.title ) {
    db.createBook( request.body )
      .then( data => response.status( 201 ).json( data ) )
  } else {
    response.body = { error:{ message: "title cannot be blank" }}
    return response.status( 400 ).json( response.body )
  }
})

router.get( '/', ( request, response ) => {
  let page = parseInt( request.query.page, 10 ) || 1
    db.getBooks( page )
      .then( data => { return response.status( 200 ).json( data ) })
      .catch(error => {
        // console.log('im an error1!')
        console.log( error )
        response.render('error', {error})
      })
})

// router.get( '/api/author', ( request, response ) => {
//   let page = parseInt( request.query.page, 10 ) || 1
//   db.showAuthors( page )
//     .then( data => {
//       console.log(data)
//       return response.status( 200 ).json( data ) })
//     .catch(error => {
//       // console.log('im an error1!')
//       console.log( error )
//       response.render('error', {error})
//     })
//
// })
router.get( '/?author=phILip', ( request, response ) => {
  console.log('got to route');
  const {authorName} = request.query
  db.retrieveBooksByAuthor( authorName )
    .then( data => {
      console.log(data);
      return response.status( 200 ).json( data ) })
    .catch(error => {
      // console.log('im an error1!')
      console.log( error )
      response.render('error', {error})
    })

})
module.exports = router
