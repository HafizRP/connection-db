const crypto = require('crypto')
const { UUIDV4: createId } = require('sequelize')
const { Nim: nim, User: user, Details: details, Roles: roles, Sequelize, sequelize } = require('../entities')

const userController = require('./user.controller')

const controller = {
    userController: new userController({ crypto, user, nim, details, roles, Sequelize, sequelize, createId })
}

module.exports = controller