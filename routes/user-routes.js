const express = require('express')

const { User } = require('../models')

const router = express.Router()

router.post('/', async function createUser(req, res) {
    const { username } = req.body

    const user = await User.create({
        firstName: username,
    })

    try {
        sprint.addUser(new User(username))
        res.statusMessage = 'OK'
        res.status(200)
        res.json(sprint.users)
    } catch (err) {
        res.statusMessage =
            'Error: That username is already taken. Try with a different one.'
        res.status(403).end()
    }
})

module.exports = router
