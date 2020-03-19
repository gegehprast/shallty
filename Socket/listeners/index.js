const a = require('./A')
const b = require('./B')

module.exports = (io, socket) => {
    socket.on('a', function (data) {
        a(io, socket, data)
    })

    socket.on('b', function (data) {
        b(io, socket, data)
    })

    return io
}