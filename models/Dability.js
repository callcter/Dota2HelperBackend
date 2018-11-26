const Sequelize = require('sequelize')
const db = require('../config/database')

const Dability = db.define('dability', {
  sid: {
    type: Sequelize.INTEGER,
    unique: true
  },
  name: {
    type: Sequelize.STRING
  },
  name_l: {
    type: Sequelize.STRING
  },
  img_url: {
    type: Sequelize.STRING
  }
},{
  tableName: 'dabilities'
})

module.exports = Dability