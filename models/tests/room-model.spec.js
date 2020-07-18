const assert = require('assert')
const Room = require('../room-model')
const User = require('../user-model')

describe('Room', function () {
    describe('new Room()', function () {
        it('throws error when instantiated without name', function () {
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

        it('instantiates with name', function () {
            assert.doesNotThrow(() => new Room('foo'))
        })
    })

    describe('instance room #addUser', function () {
        let room = null

        beforeEach(() => {
            room = new Room('foo')
        })

        it('accepts User instance room as user', function () {
            assert.doesNotThrow(() => room.addUser(new User('foobar')))
        })

        it('throws error when string as user', function () {
            assert.throws(
                () => room.addUser('foobar'),
                (err) => {
                    assert(err instanceof Error)
                    assert(/expected instanceof User/.test(err))
                    return true
                }
            )
        })

        it('throws error when repeat username is detected in the same room', function () {
            const user1 = new User('bar')
            const user2 = new User('bar')

            assert.doesNotThrow(() => room.addUser(user1))
            assert.throws(
                () => {
                    room.addUser(user2)
                },
                (err) => {
                    assert(err instanceof Error)
                    assert(/already taken/.test(err))
                    return true
                }
            )
        })
    })

    describe('instance room #getUsers', function () {
        it('returns array of User objects', function () {
            const room = new Room('foo')
            const userFoo = new User('foo')
            room.addUser(userFoo)

            const users = room.getUsers()

            assert(users.length === 1)
            users.forEach((u) => {
                assert(u instanceof User)
            })
        })
        it('returns empty array when empty', function () {
            const room = new Room('foo')
            const actual = room.getUsers()

            assert.deepStrictEqual(actual, [])
        })
    })

    describe('instance room #removeUserById', function () {
        const room = new Room('foo')
        const userFoo = new User('foo')
        const userBar = new User('bar')

        it('removes user with specified id if it exists', function () {
            room.addUser(userFoo)
            room.addUser(userBar)
            assert(room.getUsers().length === 2)

            room.removeUserById(userFoo.id)
            assert(room.getUsers().length === 1)

            room.removeUserById(userBar.id)
            assert(room.getUsers().length === 0)
        })

        it('throws error when user with specified id cannot be found in room', function () {
            assert.throws(
                () => room.removeUserById(userFoo.id),
                (err) => {
                    assert(err instanceof Error)
                    assert(/was not removed/.test(err))
                    return true
                }
            )
        })
    })

    describe('class Room #createOrGetByName', function () {
        beforeEach(() => {
            Room.resetRoomsPool()
        })

        it('accepts string as room name', function () {
            assert.doesNotThrow(() => Room.createOrGetByName('foo bar'))
        })

        it('always returns a room instance', function () {
            const actual = Room.createOrGetByName('foo bar')

            assert(actual instanceof Room)
        })

        it('returns the created room if one is created', function () {
            const actual = Room.createOrGetByName('foo bar')

            assert.strictEqual(actual.name, 'foo bar')
        })

        it('creates new room instance room and adds to internal Rooms pool', function () {
            const room = Room.createOrGetByName('foo bar')
            const roomFromPool = Room.rooms[0]

            assert.deepStrictEqual(room, roomFromPool)
        })

        it('does not create new room if one with the same name already exists', function () {
            const room1 = Room.createOrGetByName('foo bar')
            const room2 = Room.createOrGetByName('foo bar')

            assert.strictEqual(Room.rooms.length, 1)

            assert.deepStrictEqual(room1, room2)
        })
    })

    describe('class Room #getById', function () {
        it('returns undefined if no room found by id', function () {
            const actual = Room.getById('xxx')

            assert.strictEqual(actual, undefined)
        })

        it('returns room instance if found by id', function () {
            const room = Room.createOrGetByName('bar foo')
            const actual = Room.getById(room.id)

            assert.deepStrictEqual(actual, room)
        })
    })
})
