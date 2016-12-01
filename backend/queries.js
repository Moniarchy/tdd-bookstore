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
const createBook = ( title, year ) => {
  const sql = `
    INSERT INTO books( title, year ) VALUES ( $1, $2 ) RETURNING *`
  const variables = [ title, year ]
  return database.one( sql, variables )
  // return Promise.all([
  //   createAuthor( author )
  //   associateBookWithAuthor( author )
  //   .catch( error => { console.log( 'A', error ); throw error }),
  //
  //   createGenre( genres )
  //   .catch( error => { console.log( 'B', error ); throw error }),
  //
  //   database.one( sql, variables )
  //   .catch( error => { console.log( 'C', error  ); throw error })
  // ])
}

const createAuthor = authorName => {
  const sql = `
  INSERT INTO
  authors (name)
  VALUES
  ($1)
  RETURNING
  *
  `
  return database.one( sql, [authorName] )
}

const associateBookWithAuthor = ( book, author ) => {
  const sql = `
  INSERT INTO
  book_authors( book_id, author_id )
  VALUES
  ( $1, $2 )
  RETURNING
  *
  `
  const variables = [book.id, author.id]
  return database.one( sql, variables )
}
const createGenre = ( book, genres ) => {
  console.log(genres);
  for( genre in genres ){
    const sql = `
    INSERT INTO
    genres ( name )
    VALUES
    ($1)
    `
    const variable = [genre]
    const sqlTwo=`
    INSERT INTO
    book_genres ( book_id, genre_id )
    VALUES
    ( $1, $2 )`
    const variables = [ book.id, genre.id ]
  }
  return database.manyOrNone( sql, variables )
}


  //   .then( data => {
  //     deserializeGenres(data[1].name)
  //     data[1].name = JSON.parse(data[1].name)
  //     return data
  // })
  //   .then( data => {
  //     // console.log('-------', data);
  //     // console.log(book)
  //     return Promise.all([
  //       associateBookWithAuthor( data[2], data[0] ),
  //       associateBookWithGenre( data[2], data[1] ),
  //     ]).then( result => {
  //       // console.log(result);
  //       return result} )
  //   })
  //   .then( book => {
  //     getBookById( 2 )
  //     console.log( '------------', book )
  //   })
  //   .catch( error => {console.log( 'E', error ); throw error})
  //



// JSON.stringify(genreName.sort())


const associateBookWithGenre = ( book, genres ) => {
  const sql = `
    INSERT INTO
      book_genres( book_id, genre_id )
    VALUES
      ( $1, $2 )
    RETURNING
      *
  `
  const variables = [book.id, genres.id, genres.name]
  return database.one( sql, variables )
}

const deserializeGenres = genres => {
  genres = JSON.stringify(genres)
  return genres
}

const getBookById = bookID => {
  const sql = `
  SELECT * FROM books
  WHERE id = ( $1 )
  `

const variables = [bookID]
return database.one( sql, variables )
}


module.exports = {
  createAuthor,
  createBook,
  createGenre,
  setup,
  reset,
}


//sql query that inserts new book into the database
//sql query that inserts author name into author table
//sql query that joins the new book's id to an author id in the book_authors TABLE
//sql query that inserts genre name into genre table
//sql query that joins the new book's id to an genre id in the book_genres TABLE
