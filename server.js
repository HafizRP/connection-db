const express = require('express')
const { PORT } = require('./config')
const userRoutes = require('./src/routes/user')

const app = express()

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('', userRoutes)

require('./src/entities')

app.get('/', (req, res) => {
    res.send("Nah you seen nothin")
})

app.listen(PORT, () => {
    console.log("Hello", PORT)
})