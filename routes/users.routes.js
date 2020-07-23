const express = require('express')

const { User } = require('../models')

const router = express.Router()

router.post('/', function root(req, res) {
    res.render('index')
})

module.exports = router
