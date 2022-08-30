class UserServices {
    constructor({ crypto, user, nim, details, roles, Sequelize, sequelize }) {
        this.roles = roles
        this.nim = nim
        this.crypto = crypto
        this.User = user
        this.details = details
        this.Sequelize = Sequelize
        this.sequelize = sequelize
    }

    getUser() {
        return this.User.findAll({ include: [{ model: this.nim, as: 'userNim' }, { model: this.details, as: 'userDetails' }, { model: this.roles, as: 'userRoles' }] })
    }

    getUserById(id) {
        return this.User.findOne({ where: { id: id } })
    }

    async createUser(user) {
        const t = await this.Sequelize.transaction()
        const { Op } = this.sequelize
        try {
            if (user.username === null || user.username === "" || user.username === undefined) return Promise.reject({ status: 400, message: "username has to defined" })

            const User = await this.User.create({ username: user.username }, { transaction: t })
            const Nim = await this.nim.create({ nim: user.nim }, { transaction: t })
            const Details = await this.details.create({ phoneNumber: user.phoneNumber }, { transaction: t })

            const Roles = await this.roles.findAll({
                where: {
                    id: {
                        [Op.or]: !user.roles ? [1] : user.roles
                    },
                },
            })

            if (!Roles || !Roles.length) return Promise.reject({ status: 400, message: "Role has to defined!" })
            if (Roles.length >= 3) return Promise.reject({ status: 400, message: "Max user role is 3!" })

            await User.setUserDetails(Details, { transaction: t })
            await User.setUserNim(Nim, { transaction: t })
            await User.setUserRoles(Roles, { transaction: t })

            await t.commit()
        } catch (error) {
            await t.rollback()
            return Promise.reject({ status: 500, message: error.message || 'Server error' })
        }
    }

    async deleteUser(id) {
        try {
            const user = await this.User.findByPk(id, { raw: true })
            if (!user) return Promise.reject({ status: 400, message: "user not found!" })
            await this.User.destroy({ where: { id: id } })
        } catch (error) {
            return Promise.reject({ status: 500, message: error })
        }
    }


    async updateUser(id, data) {
        try {
            const user = await this.User.findByPk(id)
            if (!user) return Promise.reject({ status: 400, message: "User not found!" })

            await this.User.update({ class: data.class }, {
                where: {
                    id: id
                }
            })
        } catch (error) {
            return Promise.reject({ status: 500, message: error.message || "Server error" })
        }
    }

    async removeRoles(id, data) {
        const { Op } = this.sequelize
        try {
            const user = await this.User.findByPk(id)
            const roles = await this.roles.findAll({
                where: {
                    role: {
                        [Op.or]: data.roles
                    }
                },
            })
            const userRoles = await user.getUserRoles()

            const dbRoles = userRoles.map(val => val.role)
            const inputRoles = roles.map(val => val.role)
            const checkRoles = inputRoles.every(i => dbRoles.includes(i))

            if (userRoles.length === 0) return Promise.reject({ status: 400, message: "This user didnt has roles" })
            if (!checkRoles) return Promise.reject({ status: 400, message: "This roles in not belongs to you!" })
            if (!user) return Promise.reject({ status: 400, message: "User not found!" })
            if (!roles) return Promise.reject({ status: 400, message: "Role not found" })

            await user.removeUserRoles(roles)
        } catch (error) {
            return Promise.reject({ status: 500, message: error.message || "Server error" })
        }
    }

    async addRoles(id, data) {
        const { Op } = this.sequelize
        try {
            const user = await this.User.findByPk(id)
            const roles = await this.roles.findAll({
                where: {
                    role: {
                        [Op.or]: data.roles
                    }
                },
            })

            const userRoles = await user.getUserRoles()

            const dbRoles = userRoles.map(val => val.role)
            const inputRoles = roles.map(val => val.role)

            const checkRoles = inputRoles.every(i => dbRoles.includes(i))

            if (checkRoles) return Promise.reject({ status: 400, message: "You already has the roles!" })
            if (!user) return Promise.reject({ status: 404, message: "user not found" })
            if (roles.length === 0) return Promise.reject({ status: 404, message: "Role not exist" })

            await user.addUserRoles(roles)
        } catch (error) {
            return Promise.reject({ status: 500, message: error.message || "Server error" })
        }
    }
}

module.exports = UserServices;
