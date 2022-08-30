const Sequelize = require('sequelize')
const { db: dbConfig } = require('../../config')

const dbInstance = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, dbConfig.options)

const db = {}

db.Sequelize = dbInstance
db.sequelize = Sequelize
db.User = require('./user.js')(dbInstance, Sequelize)
db.Nim = require('./identifier')(dbInstance, Sequelize)
db.Details = require('./image')(dbInstance, Sequelize)
db.Roles = require('./roles')(dbInstance, Sequelize)

db.User.hasOne(db.Nim, { foreignKey: "userId", as: "userNim" })
db.Nim.belongsTo(db.User, { foreignKey: "userId" })

db.User.hasOne(db.Details, { foreignKey: "userId", as: "userDetails" })
db.Details.belongsTo(db.User, { foreignKey: "userId" })

db.User.belongsToMany(db.Roles, { through: "roles_user", as: 'userRoles' })
db.Roles.belongsToMany(db.User, { through: "roles_user" })

const model = db.User

for (let assoc of Object.keys(model.associations)) {
    for (let accessor of Object.keys(model.associations[assoc].accessors)) {
        console.log(model.name + '.' + model.associations[assoc].accessors[accessor] + '()');
    }
}


dbInstance.sync()
module.exports = db