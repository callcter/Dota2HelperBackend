const Sequelize = require('sequelize')
const db = require('../config/database')

const Dhero = db.define('dhero', {
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
  bio: {
    type: Sequelize.TEXT
  },
  atk: {
    type: Sequelize.STRING
  },
  atk_l: {
    type: Sequelize.STRING
  },
  roles: {
    type: Sequelize.STRING
  },
  roles_l: {
    type: Sequelize.STRING
  },
  avatar_sb: {
    type: Sequelize.STRING
  },
  avatar_full: {
    type: Sequelize.STRING
  },
  avatar_vert: {
    type: Sequelize.STRING
  },
  main_attr: {
    type: Sequelize.STRING
  },
  movespeed: {
    type: Sequelize.INTEGER
  },
  damage: {
    type: Sequelize.STRING
  },
  armor: {
    type: Sequelize.FLOAT
  },
  strength: {
    type: Sequelize.STRING
  },
  agility: {
    type: Sequelize.STRING
  },
  intelligence: {
    type: Sequelize.STRING
  }
},{
  tableName: 'dheroes'
})

module.exports = Dhero