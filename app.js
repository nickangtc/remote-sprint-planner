const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')

const indexRouter = require('./routes/index-routes')
const roomsRouter = require('./routes/rooms-routes')
const { ConnectionsPool } = require('./models/connections-pool-model')

const app = express()

app.use(logger('dev'))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'hbs')

// client connections for server sent events (EventSource API)
app.locals.cPool = new ConnectionsPool()

app.use('/', indexRouter)
app.use('/rooms', roomsRouter)
app.use('*', function (req, res) {
    res.send('sorry, the only thing found here are these numbers: 404')
})

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
