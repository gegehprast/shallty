import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
    throw new Error(
        'Please define the MONGODB_URI environment variable inside .env.local'
    )
}

type Cached = { conn: null | Mongoose; promise: null | Promise<Mongoose> }

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// @ts-ignore: Unreachable code error
let cached: Cached = global.mongoose

if (!cached) {
    // @ts-ignore: Unreachable code error
    cached = global.mongoose = { conn: null, promise: null }
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts: mongoose.ConnectOptions = {
            bufferCommands: false,
            autoIndex: true,
        }

        cached.promise = mongoose
            .connect(MONGODB_URI!, opts)
            .then((mongoose) => {
                console.log('DB connected.')
                return mongoose
            })
            .catch((err) => {
                console.log('DB connect error.', err)

                return null
            })
    }
    cached.conn = await cached.promise
    return cached.conn
}

export async function dbDisconnect() {
    if (cached.conn) {
        await cached.conn.disconnect().then(() => {
            console.log('DB disconnected.')
        })
    }
}
