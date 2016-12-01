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
  // console.log(title, author, year, genres);
  const sql = `
    INSERT INTO books( title, year ) VALUES ( $1, $2 ) RETURNING *`
  const variables = [ title, year ]
  return Promise.all([
    createAuthor( author ).catch( error => { console.log( 'A', error ); throw error }),
    createGenre( genres ).catch( error => { console.log( 'B', error ); throw error }),

    database.one( sql, variables ).catch( error => { console.log( 'C', error  ); throw error })
  ]).then( data => {
      deserializeGenres(data[1].name)
      data[1].name = JSON.parse(data[1].name)
      return data
    })
    .then(( [ author, genres, book ] ) => {
      // console.log(book)
      return Promise.all([
        associateBookWithAuthor( book, author ),
        associateBookWithGenre( book, genres ),
      ]).then( result => {
        // console.log(result);
        result} )
    })
    .catch( error => {console.log( 'E', error ); throw error})

}

const createAuthor = ( authorName ) => {
  const sql = `
    INSERT INTO
      authors (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [authorName]
  return database.one( sql, variables )
}

const createGenre = ( genreName ) => {
  const sql = `
    INSERT INTO
      genres (name)
    VALUES
      ($1)
    RETURNING
      *
  `
  const variables = [JSON.stringify(genreName.sort())]
  return database.one( sql, variables )
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
  const variables = [book.id, author.id, author.name]
  return database.one( sql, variables )
}

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


module.exports = {
  createBook,
  setup,
  reset,
}
