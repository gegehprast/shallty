import db from '../models'

const connect = async (retry = true): Promise<boolean> =>  {
    try {
        console.log('Connecting to MongoDB.')

        await db.mongoose.connect(
            `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@shalltycluster0.zxus0.mongodb.net/${process.env.MONGO_TEST_DB}?retryWrites=true&w=majority`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                useCreateIndex: true,
            }
        )

        console.log('Successfully connected to MongoDB.')

        return true
    } catch (error) {
        console.error('Connection error: ', error)
        console.log(process.env.MONGO_USERNAME, process.env.MONGO_PASSWORD)

        if (retry) {
            console.log('Retrying connection to MongoDB.')

            return connect()
        }

        return false
    }
}

export default connect
