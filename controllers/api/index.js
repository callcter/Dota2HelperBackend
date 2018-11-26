const express = require('express')
const router = express.Router()

const matchRoute = require('./match')

router.use('/match', matchRoute)

module.exports = router