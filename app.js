const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const events = require('events')

const indexRouter = require('./routes/routes-index')

const app = express()

app.use(logger('dev'))
app.use(express.json({ limit: '10mb', extended: true}))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

// client connections for server sent events (EventSource API)
app.locals.connections = []

const { EventEmitter } = events
app.locals.eventEmitter = new EventEmitter()
// app.use((req, res, next) => {
//     // setup emitevent.on('userjoin')
//     // setup emitevent.on('userexit')
//     // setup emitevent.on('uservote')
//     next()
// })

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
    next(createError(404))
})

// error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.send('error')
})

module.exports = app
