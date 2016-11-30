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
  return database.any(`
    TRUNCATE books;
  `)
}
const createBook = ( title, author, year, genres ) => {
  const sql =`
  INSERT into
    books( title, author, year, genres )
  VALUES
    ( $1, $2, $3, $4 )
  RETURNING *`

  const variables = [ title, author, year, genres ]
  return database.manyOrNone( sql, variables )
}

// const getBooks = ( page = 1 ) => {
//   const offset = ( page - 1 ) * 10
//   const sql = `SELECT * FROM books LIMIT 10 OFFSET $2`
//   return db.manyOrNone(sql, offset)
// }
//
// const searchBook = (id) => {
//   const sql = `SELECT * FROM books WHERE id = ${id}`
//   return db.oneOrNone(sql)
// }
//
// const getBooksByAuthor = (str) => {
//   const sql = `SELECT * FROM books WHERE author = ${str}`
//   return db.oneOrNone(sql)
// }
//
// const getBooksByTitle = (str) => {
//   const sql = `SELECT * FROM books WHERE title = ${str}`
//   return db.oneOrNone(sql)
// }
//
// const getBooksByYear = (num) => {
//   const sql = `SELECT * FROM books WHERE year = ${num}`
//   return db.oneOrNone(sql)
// }
//
// const getBookByTitleAndYear = (str,num) => {
//   const sql = `SELECT * FROM books WHERE title = ${str} AND year = ${num}`
//   return db.oneOrNone(sql)
// }
//
// const getAuthors = (id) => {
//   const sql = `SELECT DISTINCT author FROM books LIMIT 10`
//   return db.oneOrNone(sql)
// }
//
// const getBooksByGenre = (str) => {
//   const sql = `SELECT * FROM books WHERE genre = ${str}`
//   return db.oneOrNone(sql)
// }
//
// const deleteBook = (id) => {
//   const sql = `DELETE * FROM books WHERE id = ${id}`
//   return db.none()
// }

module.exports = {
  createBook,
  setup,
  reset,
}
