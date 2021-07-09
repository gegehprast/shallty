import dotenv from 'dotenv'
dotenv.config()

import initHTTP from './http'
import db from './models'

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

    if (process.env.HTTP === 'true') {
        initHTTP()
    }

}).catch(err => {
    console.error('Connection error: ', err)
    console.log(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD)
    process.exit()
})
