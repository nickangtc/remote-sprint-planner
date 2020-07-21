const BaseModel = require('./base-model')

class User extends BaseModel {
    constructor(username) {
        super()

        if (!username) {
            throw new Error('user must be instantiated with username')
        }
        this.username = username
    }
}

module.exports = User
