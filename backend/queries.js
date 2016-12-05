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
  return Promise.all([
    database.any(`TRUNCATE books;`)
  ])
}

const insertBook = ( title, year ) => {
  return database.query('INSERT INTO books ( title, year ) VALUES ( $1, $2 ) RETURNING id',[ title, year ]).then(result => result[0].id )
}
const insertAuthor = (authorName) => {
  return database.query( 'INSERT INTO authors (name) VALUES ($1) RETURNING id', [authorName]).then(result => result[0].id )
}
const insertGenre = ( genre ) => {
  return findGenreByName(genre.name).then(existingGenre => {
    if (existingGenre){ return existingGenre.id }
    return database.query( 'INSERT INTO genres ( name ) VALUES ($1) RETURNING id', [genre]).then(result => result[0].id )
  })
}
const associateBookWithAuthor = ( book, author ) => {
  return database.query( 'INSERT INTO book_authors( book_id, author_id ) VALUES ( $1, $2 )', [book, author] )
}
const associateBookWithGenre = ( book, genres ) => {
  return database.query( 'INSERT INTO book_genres( book_id, genre_id ) VALUES ( $1, $2 ) ', [book, genres] )
}
const findGenreByName = ( genre ) => {
  return database.query('SELECT * FROM genres WHERE name = $1 LIMIT 1', [genre]).then(result => result[0])
}

const genreColumnSet = pgp.helpers.ColumnSet([ 'book_id', 'genre_id' ], { table: 'book_genres' })

const associateBookWithGenres = ( book_id, genreIds ) => {
  const values = genreIds.map( genre_id => ({ book_id, genre_id }) )

  return database.none( pgp.helpers.insert( values, genreColumnSet ))
}

const createBook = book => {
  return Promise.all([
    insertBook( book.title, book.year ),
    insertAuthor( book.author ),
    Promise.all( book.genres.map(insertGenre) )
  ]).then( ([ bookId, authorId, genresIds ]) => {
      return Promise.all([
        associateBookWithAuthor( bookId, authorId ),
        associateBookWithGenres( bookId, genresIds )
      ]).then( result => bookId )
  })
  .then( bookId => getBookById( bookId ))
  .catch( error => console.log( 'ERROR', error ))
}

const getBookById = bookID => {
  return database.query( 'SELECT * FROM books WHERE id = ( $1 )', [ bookID ] )
    .then( book => {
      return Promise.all([
        [ book[ 0 ] ],
        getBookGenres( [ bookID ] ),
        getBookAuthors( [ bookID ] )
      ])
    })
    .then( createBookResults )
    .then( results => results[ 0 ] )
}

const getBookGenres = bookIds =>
  database.query(
    'SELECT * FROM book_genres JOIN genres ON book_genres.genre_id=genres.id WHERE book_genres.book_id IN ($1:csv) ORDER BY genres.name',
    [ bookIds ]
  )

const getBookAuthors = bookIds =>
  database.query(
    'SELECT * FROM book_authors JOIN authors ON book_authors.author_id=authors.id WHERE book_authors.book_id IN ($1:csv)',
    [ bookIds ]
  )

const createBookResults = ([ books, bookGenres, bookAuthors ]) => {
  return books.map( book => {
    const author = bookAuthors.find( bookAuthor =>
      bookAuthor.book_id === book.id
    ).name

    const genres = bookGenres.filter(
      bookGenre => bookGenre.book_id === book.id
    ).map( genre => genre.name )

    return Object.assign( {}, book, { author, genres })
  })
}

const getBooks = page => {
  const offset = ( page - 1 ) * 10

  return database.query( 'SELECT * FROM books LIMIT 10 OFFSET $1', [offset])
    .then( books => {
      bookIds = books.map( book => book.id )

      return Promise.all([
        books,
        getBookGenres( bookIds ),
        getBookAuthors( bookIds )
      ])
    })
  .then( createBookResults )


  // return database.query(
  // 'SELECT * FROM books LIMIT 10 OFFSET $1', offset)
  // .then( books => {
  //   books.forEach( book => {
  //     getAuthors(book.id)
  //     getGenres(book.id).then( data => {
  //       const genreArray = data.filter()
  //
  //       console.log(data)
  //     })
  //   })
  // })
}

const retrieveBooksByAuthor = authorName => {
  const variables = [
    '%'+query.replace(/\s+/,'%').toLowerCase()+'%',
    offset,
  ]
  return database.query('SELECT * FROM books JOIN book_authors ON book_authors.book_id = books.id JOIN authors ON book_authors.author_id = authors.id WHERE name = $1', [variables])
}

const showAuthors = page => {
  const offset = ( page - 1 ) * 10

  return database.query( 'SELECT name AS authors FROM authors LIMIT 10 OFFSET $1', [offset] )
}

const showGenres = page => {
  const offset = ( page - 1 ) * 10

  return database.query( 'SELECT name AS genres FROM genres LIMIT 10 OFFSET $1', [offset] )
}


// getOneBook

const getAuthors = bookId => {
  return database.query('SELECT * FROM authors JOIN book_authors ON book_authors.author_id = authors.id WHERE id = $1', [bookId])
}
const getGenres = bookId => {
  // console.log(bookId);
  return database.query('SELECT * FROM genres JOIN book_genres ON book_genres.genre_id = genres.id WHERE book_id = $1', [bookId])
}


module.exports = {
  getBooks,
  showAuthors,
  showGenres,
  retrieveBooksByAuthor,
  createBook,
  setup,
  reset,
}
