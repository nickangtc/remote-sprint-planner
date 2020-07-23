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
router.post('/:sprintId/users', function (req, res) {
    const { username } = req.body
    const { sprintId } = req.params

    const sprint = Sprint.getById(sprintId)

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

router.post('/:sprintId/votes', function (req, res) {
    const { sprintId } = req.params
    // const { cPool } = req.app.locals

    // const cnts = cPool.getConnections(sprintId)

    cnts.forEach((cnt) => {
        cnt.write(`event: vote\n`)
        cnt.write(`data: ${JSON.stringify(req.body)}\n\n`)
    })
    res.json({
        status: 'OK',
    })
})

router.get('/:sprintId/subscribe', async function events(req, res) {
    const { sprintId } = req.params
    // const { cPool } = req.app.locals
    res.set(sseHeaders)
    res.flushHeaders()

    // Tell the client to retry every 10 seconds if connectivity is lost
    res.write('retry: 10000\n\n')

    // cPool.addConnection(sprintId, res)

    req.on('close', () => {
        console.log('a connection closed')
        // cPool.removeConnection(sprintId, res)
    })

    // const sprintConnections = cPool.getConnections(sprintId)
    console.log('sprintConnections.length:', sprintConnections.length)
})

router.post('/', async function createSprint(req, res) {
    const sprintName = _.isEmpty(req.body['sprint-name'])
        ? utils.generateRandomName()
        : req.body['sprint-name']

    // const sprint = Sprint.createOrGetByName(sprintName)
    const sprint = await Sprint.create({
        name: sprintName,
        isCompleted: false,
    })

    res.redirect(`/sprints/${sprint.id}`)
})

router.get('/:sprintId', async function getSprint(req, res) {
    const { sprintId } = req.params
    const sprint = await Sprint.findOne({
        where: {
            id: sprintId,
        },
    })

    if (!sprint) {
        res.redirect('/')
    } else if (sprint.isCompleted) {
        res.send(
            "hmm, the sprint planning session you're looking for has already completed."
        )
    } else {
        res.render('sprint', { id: sprint.id, name: sprint.name })
    }
})

module.exports = router
