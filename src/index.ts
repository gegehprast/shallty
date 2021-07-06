import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import db from './models'

const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

app.get('/', (req, res) => {
    res.send('Hello world!')
})

db.mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@shalltycluster0.zxus0.mongodb.net/${process.env.MONGO_TEST_DB}?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    }
).then(() => {
    console.log('Successfully connected to MongoDB.')
    app.listen(process.env.APP_PORT || 3000, () => console.log('Server started!'))
}).catch(err => {
    console.error('Connection error: ', err)
    console.log(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD)
    process.exit()
})
