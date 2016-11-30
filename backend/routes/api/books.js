const express = require('express');
const router = express.Router();
const books = require('/test/books')


//CreateBook
router.post( '/api/books', ( request, response ) => {
  const { title, author, year, genres } = request.body
  console.log({ title, author, year, genres })
  db.createBook( title, author, year, genres )
    .then( () => {
      response.json(null) })
    .catch( error => { response.status(500).json({ error }) })
})

module.exports = {
  router,
  createBook,
}
