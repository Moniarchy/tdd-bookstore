const databaseName = 'tddBookstore'
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const database = pgp(connectionString)


const dropDatabase = () => {
  const sql = `DROP DATABASE tddBookstore;`

  return database.none(sql)
}

const createDatabase = () => {
  const sql = `CREATE DATABASE tddBookstore;`

  return database.one(sql)
}

// const resetDatabase = () => {
//   Promise.all = ([
//     dropDatabase(),
//     createDatabase()
//   ]).then( base => {
//     return database.one()
//   })
//
// }

const resetDatabase = () => {
  dropDatabase(),
  createDatabase()

  return database.one()

}

module.exports = {
  createDatabase,
  dropDatabase,
  resetDatabase
}
