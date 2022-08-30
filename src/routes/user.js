const router = require('express').Router()
const { userController } = require('../controllers')

router.get('/users', (req, res) => {
    userController.getUser().then((result) => {
        res.status(200).send(result)
    }).catch((err) => {
        res.status(500).send(err)
    });
})
router.get('/user', async (req, res) => {
    try {
        const user = await userController.getUserById(req.query.id)
        res.status(200).send(user)
    } catch (error) {

    }
})

router.post('/', async (req, res) => {
    try {
        await userController.createUser(req.body)
        res.status(201).send({ status: 'success' })
    } catch (error) {
        res.status(error.status || 500).send({ status: "Error", message: error.message })
    }
})

router.post('/user/:userId', async (req, res) => {
    try {
        await userController.addRoles(req.params.userId, req.body)
        res.status(200).send({ status: "Success", message: "Roles has been added" })
    } catch (error) {
        res.status(error.status).send({ status: "Error", message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await userController.deleteUser(req.params.id)
        res.status(200).send({ status: 'success', message: "user deleted successfully" })
    } catch (error) {
        res.status(error.status).send({ status: 'failed', message: error.message })
    }
})

router.put('/user/:id', async (req, res) => {
    try {
        await userController.updateUser(req.params.id, req.body)
        res.status(200).send({ status: 200, message: "user created" })
    } catch (error) {
        res.status(error.status).send({ status: "Error", message: error.message })
    }
})

router.delete('/user/:id', async (req, res) => {
    try {
        await userController.removeRoles(req.params.id, req.body)
        res.status(200).send({ status: 'Success', message: "User Role deleted!" })
    } catch (error) {
        res.status(error.status || 500).send({ status: 'Failed', message: error.message })
    }
})

module.exports = router

