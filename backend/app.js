const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const routes = require('./routes/api/index')
const users = require('./routes/api/users')
const books = require('./routes/api/books')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// app.use(app.router)
// routes.initialize(app)
app.use('/api/', routes)
app.use('/api/users', users)
app.use('/api/books', books)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

// error handlers

app.use(function(error, req, res, next) {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
      stack: error.stack,
    }
  })
})


module.exports = app
