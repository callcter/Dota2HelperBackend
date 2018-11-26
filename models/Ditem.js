const Sequelize = require('sequelize')
const db = require('../config/database')

const Ditem = db.define('ditem', {
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
  cost: {
    type: Sequelize.INTEGER
  },
  secret_shop: {
    type: Sequelize.BOOLEAN
  },
  side_shop: {
    type: Sequelize.BOOLEAN
  },
  recipe: {
    type: Sequelize.BOOLEAN
  },
  img_lg: {
    type: Sequelize.STRING
  }
},{
  tableName: 'ditems'
})

module.exports = Ditem