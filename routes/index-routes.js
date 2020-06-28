const express = require('express')

const router = express.Router()

router.get('/', function root(req, res) {
    res.render('index.html')
})

router.post('/vote', function (req, res) {
    const { connections } = req.app.locals

    connections.forEach((cnt) => {
        cnt.write(`event: vote\n`)
        cnt.write(`data: ${JSON.stringify(req.body)}\n\n`)
    })
})

module.exports = router
