const Room = require('./room-model')
const User = require('./user-model')

const room1 = new Room()
console.log('room1:', room1)

const user1 = new User('nick')
const user2 = new User('mei')

console.log('user1:', user1)
console.log('user2:', user2)

room1.addUser(user1)
room1.addUser(user2)

console.log('room1.getUsers():', room1.getUsers())

room1.removeUserById(user2.id)
console.log('room1.getUsers():', room1.getUsers())