const socketIo = require('socket.io')
const { fansubListener, fantlListener } = require('./listeners')

class Socket {
    /**
     * Init socket.
     * 
     * @param {Any} http Server instance.
     */
    init(http, port) {
        const io = socketIo(http)
        const fansub = io.of('/fansub')
        const fantl = io.of('/fantl')

        fansub.on('connection', function (socket) {
            console.log('Connected to fansub')
            
            socket.on('disconnect', function (reason) {
                console.log(reason)
            })

            fansubListener(fansub, socket)
        })

        fantl.on('connection', function (socket) {
            console.log('Connected to fantl')
            
            socket.on('disconnect', function (reason) {
                console.log(reason)
            })

            fantlListener(fantl, socket)
        })

        console.log('\x1b[32m', `[Websocket Ready] You can access it at http://localhost:${port}`)
    }
}

module.exports = new Socket