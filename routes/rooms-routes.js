const express = require('express')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

router.get('/:id/subscribe', async function events(req, res) {
    const { connections } = req.app.locals
    res.set(sseHeaders)
    res.flushHeaders()

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n')

    // TODO: separate connections based on roomid -> only subscribe to roomid's events
    // store connection to emit events to later on
    connections.push(res)

    // when client triggers EventSource.close(), delete connection
    req.on('close', () => {
        console.log('!!! connection closed !!!')

        const id = connections.indexOf(res)
        connections.splice(id, 1)
    })

    console.log('connections.length:', connections.length)
})

router.post('/', function postRoom(req, res) {
    console.log('req.body:', JSON.stringify(req.body, null, 4))
    res.redirect(`/rooms/${req.body.sprintname}`)
})

router.get('/:id', function getRoom(req, res) {
    res.sendFile('room.html', { root: `${process.cwd()}/public` })
})

module.exports = router
