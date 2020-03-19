const socketIo = require('socket.io')
const listen = require('./listeners')

class Socket {
    constructor() {
        this.io = null

        this.init = this.init.bind(this)
        this.isRoomExist = this.isRoomExist.bind(this)
    }

    /**
     * Init socket.
     * 
     * @param {Any} http Server instance.
     */
    init(http, port) {
        const io = socketIo(http)

        io.on('connection', function (socket) {
            console.log('Connected')

            // eslint-disable-next-line no-unused-vars
            socket.on('disconnect', function (reason) {

            })

            listen(io, socket)
        })

        this.io = io

        console.log('\x1b[32m', `[Websocket Ready] You can access it at http://localhost:${port}`)
    }

    /**
     * Check room existence.
     * 
     * @param {String} agent Agent.
     */
    isRoomExist(roomId) {
        const room = this.io.sockets.adapter.rooms[roomId]

        return room && typeof room !== 'undefined'
    }
}

module.exports = new Socket