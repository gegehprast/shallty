import { Namespace, Socket } from 'socket.io'
import ParserManager from '../../parsers/ParserManager'

const listeners = (io: Namespace, socket: Socket) => {
    socket.on('parse', async function (params) {
        const data = await ParserManager.parse(params.link, {
            emiter: io.to(socket.id),
        })
        
        io.to(socket.id).emit('parse', data)
    })
}

export default listeners
