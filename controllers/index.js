const express = require('express')
const router = express.Router()

const homeRoute = require('./home')
const apiRoute = require('./api/index')

router.use('/', homeRoute)
router.use('/api', apiRoute)

module.exports = router