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
    router.post('/', async function createSprint(req, res) {
        const sprintName = _.isEmpty(req.body['sprint-name'])
            ? utils.generateRandomName()
            : req.body['sprint-name']

        const adminUserId = UserModelEnums.defaultAnonymousUser.id

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
        console.log(`-> new connection: (${socket.id})`)

        userSocketConnections.addConnection(socket.id, undefined)
        console.log(JSON.stringify(userSocketConnections.store, null, 4))

        socket.on('disconnecting', () => {
            console.log(`Destroying connection: (${socket.id})`)

            const sprintIds = Object.keys(socket.rooms)

            const userId = userSocketConnections.getUserIdOfConnection(
                socket.id
            )

            userSocketConnections.removeConnection(socket.id)
            console.log(JSON.stringify(userSocketConnections.store, null, 4))

            sprintIds.forEach((sprintId) => {
                io.to(sprintId).emit('disconnected', userId)
            })
        })

        socket.on('join', (data) => {
            const { username, sprintId } = data

            const userId = shortid.generate()

            const tempUser = {
                username,
                userId,
            }

            userSocketConnections.updateConnection(socket.id, userId)

            console.log(JSON.stringify(userSocketConnections.store, null, 4))

            // join socket's internally named room
            socket.join(sprintId)

            const socketIdsInSprint = Object.keys(
                io.sockets.adapter.rooms[sprintId].sockets
            )
            const userIdsInSprint = socketIdsInSprint.map((sid) => {
                return userSocketConnections.getUserIdOfConnection(sid)
            })

            // TODO: this should send an array of user objects not just userIds
            // TODO: so that newly joined user can display all usernames in active users list
            console.log('userIdsInSprint:', userIdsInSprint)

            io.to(sprintId).emit('joined', tempUser)

            // TODO: send newly joined user the latest state, especially active users list
            // io.to(sprintId).emit('refreshState', )
        })
    })

    return router
}
