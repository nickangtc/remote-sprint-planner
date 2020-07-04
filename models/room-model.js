const BaseModel = require('./base-model')
const User = require('./user-model')
const utils = require('../utils/misc-utils')

class Room extends BaseModel {
    constructor(roomName) {
        super()
        this.users = []
        this.roomName = roomName || utils.generateRandomName()
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

        if (removed === -1) {
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
