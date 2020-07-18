const express = require('express')
const _ = require('lodash')

const Room = require('../models/room-model')
const utils = require('../utils/misc-utils')
const User = require('../models/user-model')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

// TODO: decide also how to store Votes in a room
router.post('/:roomId/users', function (req, res) {
    const { username } = req.body
    const { roomId } = req.params

    const room = Room.getById(roomId)

    try {
        room.addUser(new User(username))
        res.statusMessage = 'OK'
        res.status(200)
        res.json(room.users)
    } catch (err) {
        res.statusMessage =
            'Error: That username is already taken. Try with a different one.'
        res.status(403).end()
    }
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
    const roomName = _.isEmpty(req.body['room-name'])
        ? utils.generateRandomName()
        : req.body['room-name']

    const room = Room.createOrGetByName(roomName)

    res.redirect(`/rooms/${room.id}`)
})

router.get('/:roomId', function getRoom(req, res) {
    const { roomId } = req.params
    const room = Room.getById(roomId)

    if (!room) {
        res.redirect('/')
    } else {
        res.render('room', { id: room.id, name: room.name })
    }
})

module.exports = router
