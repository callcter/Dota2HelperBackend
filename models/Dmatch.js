const Sequelize = require('sequelize')
const db = require('../config/database')

const Dmatch = db.define('dmatch', {
  match_id: {
    type: Sequelize.STRING,
    unique: true
  },
  data: {
    type: Sequelize.JSON
  }
},{
  tableName: 'dmatches'
})

module.exports = Dmatch