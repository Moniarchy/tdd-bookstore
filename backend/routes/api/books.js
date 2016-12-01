const express = require('express');
const router = express.Router();
const { createBook } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')

//CreateBook
router.post( '/', ( request, response ) => {
  const { title, year, author, genres } = request.body
  // console.log(title, author, year, genres);

  // First, create the book
  db.createBook( title, year )
  // then find or create the authors
    .then( book => {
      db.createAuthor( author )
      const authors = [] // get these
        .then(data => {return authors})

      return { book, authors }
    })
  // then associate the authors with the book
    .then( ({ book, authors }) => {
      db.associateBookWithAuthor( book, authors )
      return book
    })
  // then find or create the genres
    .then( book => {
      db.createGenre( book, genres )
        .then(data => {
          console.log( '-----', data )
        })
      const genres = [] // get these

      return { book, genres }
    })
  // then associate the genres with the book
    // .then( ({ book, genres }) => {
    //   db.associateBookWithGenre( book, genres )
    //   return book
    // })
  // then return the book as json
    .then( book => response.status( 201 ).json( book ))

  // console.log(Array.isArray(genres))
  // db.createGenre( genres )
})
// db.createBook( title, year )
// .then( book => {
//   console.log('---------', book)
//   if(book.title) {
//     response.status(201).json(book)
//   }else{ response.body = { error:{ message: "title cannot be blank" }}
//   return response.status( 400 ).json( response.body ) }
// })
// .catch( error => {
//   response.status(500).json({ error })
// })
// db.createAuthor( author )
// router.get('/api/books', (request, response, next) => {
//   let page = ( parseInt( req.query.page, 10 ) ) || 1
//   db.getBooks( page )
//     .then( response.render(//notSure))
// })
// router.get('/api/books?author=phILip', (request, response, next) => {
//   db.getBooksByAuthor(request.body.author)
//     .then(response.render(//notSure))
// })
// router.get('/api/books?title=wORld', (request, response, next) => {
//   db.getBooksByTitle(request.body.title)
//     .then(response.render(//notSure))
// })
// router.get('/api/books?year=1953', (request, response, next) => {
//   db.getBooksByYear(request.body.year)
//     .then(response.render(//notSure))
// })
// router.get('/api/books?year=1953&title=th', (request, response, next) => {
//   db.getBookByTitleAndYear(request.body.year, request.body.title)
//     .then(response.render(//notSure))
// })
// router.put('/api/book/12/delete', (request, response) => {
//   db.deleteBook(request.body.id)
//     .then(response.status(200))
// })

module.exports = router
