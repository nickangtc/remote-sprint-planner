class SocketConnectionsStore {
    constructor() {
        this.store = {}

        this.exampleConnectionObject = {
            socketId: 'userId',
            flwqu_GSn_5ba2qBAAAD: '2222',
        }
    }

    addConnection(socketId, userId = 'nameless user') {
        console.log('-> stored new connection')
        this.store[socketId] = userId
    }

    removeConnection(socketId) {
        if (!this.store[socketId]) {
            throw new Error(`No socket found: ${socketId}`)
        }
        console.log('-> destroyed connection')
        delete this.store[socketId]
    }

    getUserIdOfConnection(socketId) {
        return this.store[socketId]
    }

    updateConnection(socketId, userId) {
        this.store[socketId] = userId
        return this.store[socketId]
    }
}

module.exports = {
    SocketConnectionsStore,
}
