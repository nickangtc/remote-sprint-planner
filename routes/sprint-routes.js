const express = require('express')
const _ = require('lodash')
const shortid = require('shortid')

const { User, Sprint, SprintItem } = require('../models')
const { UserModelEnums } = require('../enums/model-enums')
const utils = require('../utils/misc-utils')
const {
    SocketConnectionsStore,
} = require('../models/old/socket-connections-model')

const router = express.Router()

const userSocketConnections = new SocketConnectionsStore()

module.exports = function sprintsRoutes(io) {
    // TODO: decide also how to store Votes in a sprint
    // router.post('/:sprintId/users', function (req, res) {
    //     const { username } = req.body
    //     const { sprintId } = req.params

    //     const sprint = Sprint.getById(sprintId)

    //     try {
    //         sprint.addUser(new User(username))
    //         res.statusMessage = 'OK'
    //         res.status(200)
    //         res.json(sprint.users)
    //     } catch (err) {
    //         res.statusMessage =
    //             'Error: That username is already taken. Try with a different one.'
    //         res.status(403).end()
    //     }
    // })

    router.post('/:sprintId/votes', function (req, res) {
        const { sprintId } = req.params
        // const { cPool } = req.app.locals

        // const cnts = cPool.getUserIdOfConnections(sprintId)

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
        const { userSocketConnections } = req.app.locals

        userSocketConnections.addConnection(sprintId, res)

        console.log('sprintConnections.length:', sprintConnections.length)
    })

    router.post('/', async function createSprint(req, res) {
        const sprintName = _.isEmpty(req.body['sprint-name'])
            ? utils.generateRandomName()
            : req.body['sprint-name']

        const adminUserId = UserModelEnums.defaultAnonymousUser.id // TODO: implement in future

        const sprint = await Sprint.create({
            name: sprintName,
            AdminUserId: adminUserId,
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

    /**
     * socket.io event handlers
     */
    io.on('connect', (socket) => {
        console.log(`New connection: (${socket.id})`)

        userSocketConnections.addConnection(socket.id, undefined)
        console.log(
            'userSocketConnections.store:',
            JSON.stringify(userSocketConnections.store, null, 4)
        )

        socket.on('disconnecting', () => {
            console.log(`Destroying connection: (${socket.id})`)

            const sprintIds = Object.keys(socket.rooms)

            const userId = userSocketConnections.getUserIdOfConnection(
                socket.id
            )

            userSocketConnections.removeConnection(socket.id)
            console.log(
                'userSocketConnections.store:',
                JSON.stringify(userSocketConnections.store, null, 4)
            )

            sprintIds.forEach((sprintId) => {
                io.to(sprintId).emit('disconnected', userId)
            })
        })

        socket.on('join', (data) => {
            const { username, sprintId } = data

            console.log('\nsprintId:', sprintId)

            const userId = shortid.generate()

            const tempUser = {
                username,
                userId,
            }

            // TODO: update socket with userId
            userSocketConnections.updateConnection(socket.id, userId)

            console.log(
                'userSocketConnections.store:',
                JSON.stringify(userSocketConnections.store, null, 4)
            )

            // join socket's internally named room
            socket.join(sprintId)

            io.to(sprintId).emit('joined', tempUser)
        })
    })

    return router
}
