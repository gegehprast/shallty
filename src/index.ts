import dotenv from 'dotenv'
dotenv.config()

import initHTTP from './http'
import initWebsocket from './socket'
import { dbConnect } from './database'

async function init () {
    const { server } = initHTTP()

    if (process.env.WEBSOCKET === 'true') {
        initWebsocket(server)
    }
    
    if (process.env.WITH_DATABASE === 'true') {
        process.env.WITH_DATABASE = 'false'

        const connect = await dbConnect()
        
        process.env.WITH_DATABASE = connect !== null ? 'true' : 'false'
    }
}

init()
