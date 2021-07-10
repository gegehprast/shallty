import { Namespace, Socket } from 'socket.io'
import ParserManager from '../../parsers/ParserManager'

const listeners = (io: Namespace, socket: Socket) => {
    socket.on('parse', async function (params) {
        const data = await ParserManager.parse(params.link)

        if (!data.success) {
            data.error = data.error.toString()
        }

        io.to(socket.id).emit('parse', data)
    })
}

export default listeners
