const a = require('../emitters/A')

module.exports = (io, socket, data) => {
    a(io, socket, data)
}