import mongoose from 'mongoose'

mongoose.Promise = global.Promise

const db = { mongoose: mongoose }

export default db
