const BaseModel = require('./base-model')
const User = require('./user-model')

class Room extends BaseModel {
    constructor(name) {
        super()

        if (!name) {
            throw new Error('room needs to be instantiated with a name')
        }

        this.users = []
        this.name = name
    }

    static initRoomsPool() {
        if (!Room.rooms) {
            Room.rooms = []
        }
    }

    static resetRoomsPool() {
        Room.rooms = []
    }

    static createOrGetByName(name) {
        Room.initRoomsPool()

        const existing = Room.rooms.find((r) => r.name === name)

        if (existing) {
            return existing
        }

        const created = new Room(name)
        Room.rooms.push(created)
        return created
    }

    static getById(id) {
        Room.initRoomsPool()

        const room = Room.rooms.find((r) => r.id === id)
        return room
    }

    validateUser(user) {
        if (!(user instanceof User)) {
            throw new Error('expected instanceof User')
        }

        const allUsernames = this.users.map((u) => u.username)
        return !allUsernames.includes(user.username)
    }

    addUser(user) {
        const isValid = this.validateUser(user)
        if (isValid) {
            this.users.push(user)
            return this
        }
        throw new Error(`username ${user.username} is already taken`)
    }

    removeUserById(userId) {
        const user = this.users.find((u) => u.id === userId)
        const index = this.users.indexOf(user)
        const removed = this.users.splice(index, 1)

        if (removed.length === 0) {
            throw new Error(`user with id ${userId} was not removed`)
        }

        return this
    }

    getUsers() {
        return this.users
    }

    addVotableItem(votableItem) {}

    getVotableItemById(votableItemId) {}
}

module.exports = Room
