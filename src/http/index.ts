import express from 'express'
import api from './routes'
import http from 'http'

const init = () => {
    const app = express()
    const server = http.createServer(app)

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.get('/', (req, res) => {
        res.send('Hello world!')
    })

    app.use('/api', api)

    server.listen(process.env.APP_PORT || 3000, () => console.info('\x1b[34m%s\x1b[0m', `[HTTP Server Ready] You can access it at http://localhost:${process.env.APP_PORT || 3000}`))

    return { server, app }
}

export default init
