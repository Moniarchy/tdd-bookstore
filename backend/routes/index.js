const express = require(express);
const router = express.Router();

router.get('/', (request, response, next) => {
response.render('index', { title: 'Express' });
});

router.get('/ping', (request, response, next) => {
  response.send('pong')
})

router.post('/api/books', (request, response, next) => {
  const {title, author, year, genres} = req.body
  db.createBook(title, author, year, genres)
    .then( response.render(//notSure))
    .catch(error => {
      response.status(404)
    })
})

router.get('/api/books', (request, response, next) => {
  let page = ( parseInt( req.query.page, 10 ) ) || 1
  db.getBooks( page )
    .then( response.render(//notSure))
})
router.get('/api/books?author=phILip', (request, response, next) => {
  db.getBooksByAuthor(request.body.author)
    .then(response.render(//notSure))
})
router.get('/api/books?title=wORld', (request, response, next) => {
  db.getBooksByTitle(request.body.title)
    .then(response.render(//notSure))
})
router.get('/api/books?year=1953', (request, response, next) => {
  db.getBooksByYear(request.body.year)
    .then(response.render(//notSure))
})
router.get('/api/books?year=1953&title=th', (request, response, next) => {
  db.getBookByTitleAndYear(request.body.year, request.body.title)
    .then(response.render(//notSure))
})
router.put('/api/book/12/delete', (request, response) => {
  db.deleteBook(request.body.id)
    .then(response.status(200))
})




module.exports = router;

const createBook = ( title, author, year, genres ) => {
  const sql = `
    INSERT INTO
      books (title, author, year, genres)
    VALUES
      ($1, $2, $3, $4)
    RETURNING
      *
  `
  const variables = [ title, author, year, genres ]
  return manyOrNone(sql, variables)

const getBooks = ( page = 1 ) => {
  const offset = ( page - 1 ) * 10
  const sql = `SELECT * FROM books LIMIT 10 OFFSET $2`
  return db.manyOrNone(sql, offset)
}

const searchBook = (id) => {
  const sql = `SELECT * FROM books WHERE id = ${id}`
  return db.oneOrNone(sql)
}

const getBooksByAuthor = (str) => {
  const sql = `SELECT * FROM books WHERE author = ${str}`
  return db.oneOrNone(sql)
}

const getBooksByTitle = (str) => {
  const sql = `SELECT * FROM books WHERE title = ${str}`
  return db.oneOrNone(sql)
}

const getBooksByYear = (num) => {
  const sql = `SELECT * FROM books WHERE year = ${num}`
  return db.oneOrNone(sql)
}

const getBookByTitleAndYear = (str,num) => {
  const sql = `SELECT * FROM books WHERE title = ${str} AND year = ${num}`
  return db.oneOrNone(sql)
}

const getAuthors = (id) => {
  const sql = `SELECT DISTINCT author FROM books LIMIT 10`
  return db.oneOrNone(sql)
}

const getBooksByGenre = (str) => {
  const sql = `SELECT * FROM books WHERE genre = ${str}`
  return db.oneOrNone(sql)
}

const deleteBook = (id) => {
  const sql = `DELETE * FROM books WHERE id = ${id}`
  return db.none()
}
