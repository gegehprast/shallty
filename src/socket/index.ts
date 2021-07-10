import http from 'http'
import { Server } from 'socket.io'
import shortlinkListener from './listeners/shortlink'

const Init = (server: http.Server) => {
    const io = new Server(server)
    const shortlink = io.of('/shortlink')

    shortlink.on('connection', function (socket) {
        console.info('\x1b[34m%s\x1b[0m', '[Websocket] Connected. Namespace: shortlink')

        socket.on('disconnect', function (reason) {
            console.info('\x1b[34m%s\x1b[0m', `[Websocket] Disconnected. Reason: ${reason}`)
        })

        shortlinkListener(shortlink, socket)
    })

    console.info('\x1b[34m%s\x1b[0m', `[Websocket] Server Ready. You can access it at http://localhost:${process.env.APP_PORT || 3000}`)
}

export default Init
