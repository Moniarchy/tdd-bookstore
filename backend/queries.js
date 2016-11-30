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
  return manyOrNone( sql, variables )
}

module.exports = {
  setup,
  reset,
}
