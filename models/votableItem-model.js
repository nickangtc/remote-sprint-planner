const BaseModel = require('./base-model')

class VotableItem extends BaseModel {
    constructor(name) {
        super()

        if (!name) {
            throw new Error('room needs to be instantiated with a name')
        }

        // item has name
        // item has votes casted by users
        // item belongs to a room -> no need to store in votableItem ?

        this.name = name
        this.votes = []
        this.aggregatedVotes = {}
    }

    aggregate() {
        // this.votes -> this.aggregatedVotes
        return {}
    }
}

module.exports = VotableItem
