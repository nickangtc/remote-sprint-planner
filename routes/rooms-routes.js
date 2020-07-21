const express = require('express')
const _ = require('lodash')

const { User, Sprint, SprintItem } = require('../models')
const utils = require('../utils/misc-utils')

const router = express.Router()

const sseHeaders = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
}

// TODO: decide also how to store Votes in a sprint
router.post('/:roomId/users', function (req, res) {
    const { username } = req.body
    const { roomId } = req.params

    const sprint = Sprint.getById(roomId)

    try {
        sprint.addUser(new User(username))
        res.statusMessage = 'OK'
        res.status(200)
        res.json(sprint.users)
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
    const roomName = _.isEmpty(req.body['sprint-name'])
        ? utils.generateRandomName()
        : req.body['sprint-name']

    const sprint = Sprint.createOrGetByName(roomName)

    res.redirect(`/sprints/${sprint.id}`)
})

router.get('/:roomId', function getRoom(req, res) {
    const { roomId } = req.params
    const sprint = Sprint.getById(roomId)

    if (!sprint) {
        res.redirect('/')
    } else {
        res.render('sprint', { id: sprint.id, name: sprint.name })
    }
})

module.exports = router
