const express = require('express')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

router.post('/:roomId/vote', function (req, res) {
    const { roomId } = req.params
    const { cPool } = req.app.locals

    const cnts = cPool.getConnections(roomId)

    cnts.forEach((cnt) => {
        cnt.write(`event: vote\n`)
        cnt.write(`data: ${JSON.stringify(req.body)}\n\n`)
    })
    res.json({
        status: 'OK',
    })
})

router.get('/:roomId/subscribe', async function events(req, res) {
    const { roomId } = req.params
    const { cPool } = req.app.locals
    res.set(sseHeaders)
    res.flushHeaders()

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n')

    // store connection to emit events to later on
    cPool.addConnection(roomId, res)

    // when client triggers EventSource.close(), delete connection
    req.on('close', () => {
        console.log('a connection closed')
        cPool.removeConnection(roomId, res)
    })

    const roomConnections = cPool.getConnections(roomId)
    console.log('roomConnections.length:', roomConnections.length)
})

router.post('/', function postRoom(req, res) {
    console.log('req.body:', JSON.stringify(req.body, null, 4))
    res.redirect(`/rooms/${req.body.sprintname}`)
})

router.get('/:roomId', function getRoom(req, res) {
    res.sendFile('room.html', { root: `${process.cwd()}/public` })
})

module.exports = router
