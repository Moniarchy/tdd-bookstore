const express = require('express');
const router = express.Router();
const { createBook } = require('../../queries')
const db = require('../../queries')
const bodyParser = require('body-parser')

//CreateBook
router.post( '/', ( request, response ) => {
  const { title, author, year, genres } = request.body
  // console.log(title, author, year, genres);

  // console.log(Array.isArray(genres))

  db.createBook( title, author, year, genres )
    .then( book => {
      // console.log(book)
      if(book.title) {
        response.status(201).json(book)
      }else{ response.body = { error:{ message: "title cannot be blank" }}
        return response.status( 400 ).json( response.body ) }
    })
    .catch( error => {
       response.status(500).json({ error })
     })
})
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
