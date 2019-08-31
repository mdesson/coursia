var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cors = require('cors')
var fs = require('fs')

// routes
var indexRouter = require('./routes/index')
var testRouter = require('./routes/test')

// Concordia API methods
var concordiaAPI = require('./public/javascripts/concordiaAPI')

var app = express()

// import config file
var rawConfig = fs.readFileSync('config.json')
var config = JSON.parse(rawConfig)

// set up mongoose connection
var mongoose = require('mongoose')
var mongoDB = `mongodb+srv://${config.dbuser}:${
  config.dbpass
}@cluster0-nh0xp.mongodb.net/coursia?retryWrites=true&w=majority`
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise
var db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

// update db if update is in argument variables
// eslint disable to avoid process undefined error
if (process.argv.includes('updateAll')) concordiaAPI.updateAll().then(() => console.log('Updated DB')) // eslint-disable-line
if (process.argv.includes('updateTerms')) concordiaAPI.updateTerms().then(() => console.log('Updated Terms')) // eslint-disable-line
if (process.argv.includes('updateCourses')) concordiaAPI.updateCourses().then(() => console.log('Updated Courses')) // eslint-disable-line
if (process.argv.includes('updateSections')) concordiaAPI.updateSections().then(() => console.log('Updated Sections')) // eslint-disable-line

// middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public'))) // eslint-disable-line

// routes
app.use('/test', testRouter)
app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
