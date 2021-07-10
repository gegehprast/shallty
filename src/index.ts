import dotenv from 'dotenv'
dotenv.config()

import initHTTP from './http'
import initWebsocket from './socket'
import connectMongo from './database'

async function init () {
    if (process.env.HTTP === 'true') {
        const { server } = initHTTP()

        if (process.env.WEBSOCKET === 'true') {
            initWebsocket(server)
        }
    }
    
    if (process.env.WITH_DATABASE === 'true') {
        process.env.WITH_DATABASE = 'false'

        const connect = await connectMongo()
        
        process.env.WITH_DATABASE = connect ? 'true' : 'false'
    }
}

init()
