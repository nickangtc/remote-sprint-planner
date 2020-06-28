const express = require('express')

const router = express.Router()

router.post('/', function postRoom(req, res) {
    console.log('req.body:', JSON.stringify(req.body, null, 4))
    res.redirect(`/rooms/${req.body.sprintname}`)
})

router.get('/:id', function getRoom(req, res) {
    res.sendFile('room.html', { root: `${process.cwd()}/public` })
})

module.exports = router
