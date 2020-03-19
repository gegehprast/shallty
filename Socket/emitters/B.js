// eslint-disable-next-line no-unused-vars
module.exports = (io, socket, data) => {
    io.emit('b', {
        msg: 'Hello B!',
    })
}