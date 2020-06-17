const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ShortlinkSchema = new Schema({
    original: {
        type: String,
        required: true,
        unique: true,
    },
    parsed: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
    updatedAt: {
        type: Date,
        default: new Date()
    },
})

const Shortlink = mongoose.model('Shortlink', ShortlinkSchema)

module.exports = Shortlink