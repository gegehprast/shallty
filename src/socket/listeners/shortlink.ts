import { Namespace, Socket } from 'socket.io'
import ParserManager from '../../parsers/ParserManager'

const listeners = (io: Namespace, socket: Socket) => {
    socket.on('parse', async function (params) {
        const data = await ParserManager.parse(params.link)
        
        io.to(socket.id).emit('parse', data)
    })
}

export default listeners
