const databaseName = 'tddBookstore'
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const database = pgp(connectionString)
const QueryFile = require('pg-promise').QueryFile



const setup = () => {
  const qf = new QueryFile(__dirname+'/schema.sql')
  return database.oneOrNone(qf)
}
const reset = () => {
  return database.any(`TRUNCATE books;`)
}

const insertBook = ( title, year ) => {
  return database.query('INSERT INTO books ( title, year ) VALUES ( $1, $2 ) RETURNING id',[ title, year ]).then(result => result[0].id )
}
const insertAuthor = (authorName) => {
  return database.query( 'INSERT INTO authors (name) VALUES ($1) RETURNING id', [authorName]).then(result => result[0].id )
}
const insertGenre = ( genre ) => {
  return database.query( 'INSERT INTO genres ( name ) VALUES ($1) RETURNING id', [genre]).then(result => result[0].id )
}
const associateBookWithAuthor = ( book, author ) => {
  return database.query( 'INSERT INTO book_authors( book_id, author_id ) VALUES ( $1, $2 )', [book, author] )
}
const associateBookWithGenre = ( book, genres ) => {
  return database.query( 'INSERT INTO book_genres( book_id, genre_id ) VALUES ( $1, $2 ) ', [book, genres] )
}
const checkForGenre = ( genre ) => {
  return database.query('SELECT name FROM genres WHERE name = ($1) RETURNING id', [genre]).then(result => result[0].id)
}

const createBook = book => {
  return Promise.all([
    insertBook( book.title, book.year ),
    insertAuthor( book.author ),
    Promise.all( book.genres.sort().map( genre =>{
      if(checkForGenre(genre)){
      }else{
       return insertGenre( genre )
      }
    }))
  ]).then( result => {
    console.log(result);
      let bookId = result[0]
      let authorId = result[1]
      let genresIds = result[2]

      return Promise.all([
        associateBookWithAuthor(bookId, authorId),
        ...genresIds.map( genreId => associateBookWithGenre( bookId, genreId ))
      ])
  })
  .then( data => book )
  .catch( error => console.log( 'ERROR', error ))
}

const getBookById = bookID => {
  return database.query( 'SELECT * FROM books WHERE id = ( $1 )', [bookID] )
}

// const getBooks = ( page = 1 ) => {
//   const offset = ( page - 1 ) * 10
//   const sql =`
//   SELECT DISTINCT title, authors, year, genres FROM books JOIN book_authors ON book_authors.book_id = books.id JOIN authors ON book_authors.author_id =  authors.id JOIN book_genres ON book_genres.book_id = books.id JOIN genres ON book_genres.genre_id = genres.id LIMIT 10 OFFSET $1
//   `
//   const variables = [offset]
//
//   return database.manyOrNone( sql, variables )
// }
const getBooks = page => {
  console.log('page!!!1',page)
  const offset = ( page - 1 ) * 10
  const variable = [offset]
  return database.query(
  'SELECT title, authors.name AS authors, year, genres.name AS genres FROM books JOIN book_authors ON book_authors.book_id = books.id JOIN authors ON book_authors.author_id =  authors.id JOIN book_genres ON book_genres.book_id = books.id JOIN genres ON book_genres.genre_id = genres.id LIMIT 10 OFFSET $1', offset)
}

module.exports = {
  getBooks,
  createBook,
  setup,
  reset,
}
