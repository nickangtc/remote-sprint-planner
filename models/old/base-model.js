const shortid = require('shortid')

class BaseModel {
    constructor() {
        this.id = shortid.generate()
    }
}

module.exports = BaseModel
