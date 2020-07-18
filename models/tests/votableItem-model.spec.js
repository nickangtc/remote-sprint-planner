const assert = require('assert')
const VotableItem = require('../votableItem-model')

describe('VotableItem', function () {
    describe('new VotableItem', function () {
        it('throws error when instantiated without name', function () {
            assert.throws(
                () => new VotableItem(),
                (err) => {
                    assert(err instanceof Error)
                    assert(
                        /votableItem needs to be instantiated with a name/.test(err)
                    )
                    return true
                }
            )
        })

        it('instantiates with name', function () {
            assert.doesNotThrow(() => new VotableItem('foo'))
        })
    })
})
