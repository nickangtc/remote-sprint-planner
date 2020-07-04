const express = require('express')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

// TODO: create or reject username in this room
// TODO: decide how to store Usernames in a room
// TODO: decide also how to store Votes in a room
router.post('/:roomId/users', function (req, res) {
    // const { roomId } = req.params
    // const { cPool } = req.app.locals

    res.json({
        status: 'OK',
    })
})

router.post('/:roomId/votes', function (req, res) {
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

    cPool.addConnection(roomId, res)

    req.on('close', () => {
        console.log('a connection closed')
        cPool.removeConnection(roomId, res)
    })

    const roomConnections = cPool.getConnections(roomId)
    console.log('roomConnections.length:', roomConnections.length)
})

router.post('/', function postRoom(req, res) {
    console.log('req.body:', JSON.stringify(req.body, null, 4))
    res.redirect(`/rooms/${req.body['room-name']}`)
})

router.get('/:roomId', function getRoom(req, res) {
    // TODO: Check if roomId exists - if not, redirect to homepage
    res.sendFile('room.html', { root: `${process.cwd()}/public` })
})

module.exports = router
