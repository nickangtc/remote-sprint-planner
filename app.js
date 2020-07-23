const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
const socketio = require('socket.io')
const http = require('http')

const indexRouter = require('./routes/index-routes')
const sprintsRouter = require('./routes/sprints-routes')

const app = express()

/**
 * Init express server
 */
const server = http.createServer(app)

const port = process.env.PORT || '8000'
server.listen(port, () => console.log(`listening on: http://localhost:${port}`))

/**
 * Init socket.io to receive and manage client connections
 */
const io = socketio(server)
app.locals.io = io

app.use(logger('dev'))
app.use(express.json({ limit: '10mb', extended: true }))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'hbs')

app.use('/', indexRouter)
app.use('/sprints', sprintsRouter(io))
app.use('*', (req, res) => {
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

