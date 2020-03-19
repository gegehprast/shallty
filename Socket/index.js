const socketIo = require('socket.io')

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

        io.use((socket, next) => {
            const agent = socket.handshake.query.agent

            if (agent && agent !== '') {
                return next()
            }

            // Handler.error('Authentication error. Disconnecting socket.', false)
            console.log('Authentication error. Disconnecting socket.')

            socket.disconnect(true)
        })

        io.on('connection', function (socket) {

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