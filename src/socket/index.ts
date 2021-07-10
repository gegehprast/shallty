import http from 'http'
import { Server } from 'socket.io'
import shortlinkListener from './listeners/shortlink'

const Init = (server: http.Server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS,
            methods: ['GET'],
            credentials: true
        }
    })
    const shortlink = io.of('/shortlink')

    shortlink.on('connection', function (socket) {
        console.info('\x1b[34m%s\x1b[0m', '[Websocket] A client has been connected. Namespace: shortlink')

        socket.on('disconnect', function (reason) {
            console.info('\x1b[34m%s\x1b[0m', `[Websocket] A client has been disconnected. Reason: ${reason}`)
        })

        shortlinkListener(shortlink, socket)
    })

    console.info('\x1b[34m%s\x1b[0m', `[Websocket] Server Ready. You can access it at http://localhost:${process.env.APP_PORT || 3000}`)
}

export default Init
