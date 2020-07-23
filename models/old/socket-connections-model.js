class SocketConnectionsStore {
    constructor() {
        this.store = {}
    }

    addConnection(socketId, userId = 'guestuser') {
        this.store[socketId] = userId
    }

    removeConnection(socketId) {
        if (!this.store[socketId]) {
            throw new Error(`No socket found: ${socketId}`)
        }
        delete this.store[socketId]
    }

    getConnection(socketId) {
        return this.store[socketId]
    }
}

module.exports = {
    SocketConnectionsStore,
}
