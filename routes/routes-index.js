const express = require('express')
const app = require('../app')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

router.get('/', function root(req, res) {
    res.render('index.html')
})

router.get('/events', async function events(req, res) {
    const { connections, eventEmitter } = req.app.locals
    res.set(sseHeaders)
    res.flushHeaders()

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n')

    // eventEmitter.emit(
    //     'userjoin',
    //     'hard coded data, but should be username + sprint room info'
    // )

    // store connection to emit events to later on
    connections.push(res)

    // close event triggered by eventSource.close() on client side
    req.on('close', () => {
        console.log('!!! connection closed !!!')

        const id = connections.indexOf(res)
        connections.splice(id, 1)
    })

    console.log('connections.length:', connections.length)
})

router.post('/vote', function (req, res) {
    const { connections, eventEmitter } = req.app.locals

    connections.forEach((conn) => {
        conn.write(`event: userVote\n`)
        conn.write(`data: ${JSON.stringify(req.body)}\n\n`)
    })
})

module.exports = router
