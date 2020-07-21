const express = require('express')

const router = express.Router()

router.get('/', function root(req, res) {
    res.render('index')
})

module.exports = router
