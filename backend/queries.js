const databaseName = 'tddBookstore'
const connectionString = process.env.DATABASE_URL || `postgres://${process.env.USER}@localhost:5432/${databaseName}`
const pgp = require('pg-promise')()
const database = pgp(connectionString)
const QueryFile = require('pg-promise').QueryFile


const dropDatabase = () => {
  const sql = `DROP TABLE books";`

  return database.none(sql)
}

const resetDb = () => {
  const qf = new QueryFile('/Users/abrahamferguson/Projects/disastrous-jicana/tdd-bookstore/backend/schema.sql')

  return database.none(qf)
}

// database seems to not actually be dropping but the test does pass
const createDatabase = () => {
  const sql = `CREATE TABLE ;`

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
  resetDb
}
