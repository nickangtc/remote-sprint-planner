const assert = require('assert')
const Sprint = require('../sprint-model')
const User = require('../user-model')

describe('Sprint', function () {
    describe('new Sprint()', function () {
        it('throws error when instantiated without name', function () {
            assert.throws(
                () => new Sprint(),
                (err) => {
                    assert(err instanceof Error)
                    assert(
                        /sprint needs to be instantiated with a name/.test(err)
                    )
                    return true
                }
            )
        })

        it('instantiates with name', function () {
            assert.doesNotThrow(() => new Sprint('foo'))
        })
    })

    describe('instance sprint #addUser', function () {
        let sprint = null

        beforeEach(() => {
            sprint = new Sprint('foo')
        })

        it('accepts User instance sprint as user', function () {
            assert.doesNotThrow(() => sprint.addUser(new User('foobar')))
        })

        it('throws error when string as user', function () {
            assert.throws(
                () => sprint.addUser('foobar'),
                (err) => {
                    assert(err instanceof Error)
                    assert(/expected instanceof User/.test(err))
                    return true
                }
            )
        })

        it('throws error when repeat username is detected in the same sprint', function () {
            const user1 = new User('bar')
            const user2 = new User('bar')

            assert.doesNotThrow(() => sprint.addUser(user1))
            assert.throws(
                () => {
                    sprint.addUser(user2)
                },
                (err) => {
                    assert(err instanceof Error)
                    assert(/already taken/.test(err))
                    return true
                }
            )
        })
    })

    describe('instance sprint #getUsers', function () {
        it('returns array of User objects', function () {
            const sprint = new Sprint('foo')
            const userFoo = new User('foo')
            sprint.addUser(userFoo)

            const users = sprint.getUsers()

            assert(users.length === 1)
            users.forEach((u) => {
                assert(u instanceof User)
            })
        })
        it('returns empty array when empty', function () {
            const sprint = new Sprint('foo')
            const actual = sprint.getUsers()

            assert.deepStrictEqual(actual, [])
        })
    })

    describe('instance sprint #removeUserById', function () {
        const sprint = new Sprint('foo')
        const userFoo = new User('foo')
        const userBar = new User('bar')

        it('removes user with specified id if it exists', function () {
            sprint.addUser(userFoo)
            sprint.addUser(userBar)
            assert(sprint.getUsers().length === 2)

            sprint.removeUserById(userFoo.id)
            assert(sprint.getUsers().length === 1)

            sprint.removeUserById(userBar.id)
            assert(sprint.getUsers().length === 0)
        })

        it('throws error when user with specified id cannot be found in sprint', function () {
            assert.throws(
                () => sprint.removeUserById(userFoo.id),
                (err) => {
                    assert(err instanceof Error)
                    assert(/was not removed/.test(err))
                    return true
                }
            )
        })
    })

    describe('class Sprint #createOrGetByName', function () {
        beforeEach(() => {
            Sprint.resetRoomsPool()
        })

        it('accepts string as sprint name', function () {
            assert.doesNotThrow(() => Sprint.createOrGetByName('foo bar'))
        })

        it('always returns a sprint instance', function () {
            const actual = Sprint.createOrGetByName('foo bar')

            assert(actual instanceof Sprint)
        })

        it('returns the created sprint if one is created', function () {
            const actual = Sprint.createOrGetByName('foo bar')

            assert.strictEqual(actual.name, 'foo bar')
        })

        it('creates new sprint instance sprint and adds to internal sprints pool', function () {
            const sprint = Sprint.createOrGetByName('foo bar')
            const roomFromPool = Sprint.sprints[0]

            assert.deepStrictEqual(sprint, roomFromPool)
        })

        it('does not create new sprint if one with the same name already exists', function () {
            const room1 = Sprint.createOrGetByName('foo bar')
            const room2 = Sprint.createOrGetByName('foo bar')

            assert.strictEqual(Sprint.sprints.length, 1)

            assert.deepStrictEqual(room1, room2)
        })
    })

    describe('class Sprint #getById', function () {
        it('returns undefined if no sprint found by id', function () {
            const actual = Sprint.getById('xxx')

            assert.strictEqual(actual, undefined)
        })

        it('returns sprint instance if found by id', function () {
            const sprint = Sprint.createOrGetByName('bar foo')
            const actual = Sprint.getById(sprint.id)

            assert.deepStrictEqual(actual, sprint)
        })
    })
})
