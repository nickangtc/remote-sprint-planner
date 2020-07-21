const BaseModel = require('./base-model')
const User = require('./user-model')

class Sprint extends BaseModel {
    constructor(name) {
        super()

        if (!name) {
            throw new Error('sprint needs to be instantiated with a name')
        }

        this.users = []
        this.name = name
    }

    static initRoomsPool() {
        if (!Sprint.sprints) {
            Sprint.sprints = []
        }
    }

    static resetRoomsPool() {
        Sprint.sprints = []
    }

    static createOrGetByName(name) {
        Sprint.initRoomsPool()

        const existing = Sprint.sprints.find((r) => r.name === name)

        if (existing) {
            return existing
        }

        const created = new Sprint(name)
        Sprint.sprints.push(created)
        return created
    }

    static getById(id) {
        Sprint.initRoomsPool()

        const sprint = Sprint.sprints.find((r) => r.id === id)
        return sprint
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
}

module.exports = Sprint
