class ConnectionsPool {
    constructor() {
        this.pool = {}
    }

    addConnection(id, res) {
        this.pool[id] = this.pool[id] ? [...this.pool[id], res] : [res]
    }

    removeConnection(id, res) {
        if (!this.pool[id]) {
            throw new Error(`Failed finding pool of connections for id: ${id}`)
        }
        const connection = this.pool[id].indexOf(res)
        this.pool[id].splice(connection, 1)
    }

    getConnections(id) {
        return this.pool[id]
    }
}

module.exports = {
    ConnectionsPool,
}
