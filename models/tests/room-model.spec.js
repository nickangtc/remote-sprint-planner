const assert = require('assert')
const Room = require('../room-model')

describe('Room', function () {
    describe('new Room()', function () {
        it('can be instantiated only with name', function () {
            assert.throws(
                () => new Room(),
                (err) => {
                    assert(err instanceof Error)
                    assert(
                        /room needs to be instantiated with a name/.test(err)
                    )
                    return true
                }
            )
        })
    })
})
