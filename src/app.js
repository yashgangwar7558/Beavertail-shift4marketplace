require('dotenv').config()
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const connectToMongoDB = require('./db/conn')
const subscriptionRouter = require('./routers/subscription')

const app = express()
const port = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(bodyParser.json())
app.use(cors())

connectToMongoDB()
    .then(() => {
        app.use(subscriptionRouter)

        app.get('/', async (req, res) => {
            res.status(200).send("Welcome to shift4api. Server is live!")
        })

        app.listen(port, () => {
            console.log(`Server is live at port no. ${port}`);
        });
    })
    .catch((err) => {
        console.error("shift4api server not live!")
        console.error("Failed to connect to database:", err.message)
        process.exit(1);
    })
