const Sequelize = require('sequelize')
const db = require('../config/database')

const Duser = db.define('duser', {
  aid: {
    type: Sequelize.STRING,
    unique: true
  },
  sid: {
    type: Sequelize.STRING,
    unique: true
  },
  nickname: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  }
},{
  tableName: 'dusers'
})

module.exports = Duser