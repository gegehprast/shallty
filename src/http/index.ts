import express from 'express'
import api from './routes'
import http from 'http'
import HomeController from './controllers/HomeController'
import path from 'path'
import setHeaders from './middlewares/set-headers'

const init = () => {
    const app = express()
    const server = http.createServer(app)

    // json middleware
    app.use(express.json())

    // url encoded middleware
    app.use(express.urlencoded({
        extended: true
    }))

    // set static public url
    app.use(express.static(path.join(__dirname, './public')))

    // set view engine
    app.set('view engine', 'pug')
    
    // set trust proxy
    app.set('trust proxy', true)

    // set views dir
    app.set('views', path.join(__dirname, './views'))

    // set headers middleware
    app.use(setHeaders)

    // home controller routes
    app.get('/', HomeController.index)
    app.get('/socket-tester', HomeController.socketTester)

    // api routes
    app.use('/api', api)

    // listen
    server.listen(process.env.APP_PORT || 3000, () => console.info('\x1b[34m%s\x1b[0m', `[HTTP Server Ready] You can access it at http://localhost:${process.env.APP_PORT || 3000}`))

    return { server, app }
}

export default init
