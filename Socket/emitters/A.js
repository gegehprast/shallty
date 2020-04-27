// eslint-disable-next-line no-unused-vars
module.exports = (io, socket, data) => {
    io.emit('a', {
        msg: 'Hello A!',
    })
}