import db from '../models'

const connect = async (retry = true): Promise<boolean> =>  {
    try {
        console.info('\x1b[34m%s\x1b[0m', '[Database] Connecting to MongoDB.')

        await db.mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@shalltycluster0.zxus0.mongodb.net/${process.env.MONGO_TEST_DB}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )

        console.info('\x1b[34m%s\x1b[0m', '[Database] Successfully connected to MongoDB.')

        return true
    } catch (error) {
        console.error('Connection error: ', error)

        if (retry) {
            console.info('\x1b[34m%s\x1b[0m', '[Database] Retrying connection to MongoDB.')

            return connect()
        }

        return false
    }
}

export default connect
