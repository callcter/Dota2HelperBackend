require('dotenv').config()

const express = require('express')
const http = require('http')
const path = require('path')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const reload = require('reload')

// const routes = require('./routes/index')
// const users = require('./routes/users')
// const apis = require('./routes/apis')

const app = express()

app.set('views', path.join(__dirname,'views'))
app.set('view engine','pug')

app.use(favicon(path.join(__dirname+'/public/favicon.ico')))
app.use(bodyParser.json({limit: '1mb'}))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname,'public')))
app.use(express.static(path.join(__dirname,'file')))

// app.use('/',routes)
// app.use('/users',users)
// app.use('/apis',apis)

app.use(require('./controllers'))

const server = http.createServer(app)
reload(app)
server.listen(4003, ()=>{})
