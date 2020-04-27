const express = require('express')
const path = require('path')
const [web, api] = require('./routes')
const isBrowserReady = require('./middlewares/isBrowserReady')
const setHeaders = require('./middlewares/setHeaders')

class Server {
    constructor() {
        this.app = null
        this.http = null
    }

    /**
     * Init server.
     * 
     */
    init(port) {
        this.app = express()
        this.http = require('http').createServer(this.app)

        this.http.listen(port, function () {
            console.log('\x1b[32m', `[Server Ready] You can access it at http://localhost:${port}`)
        })

        return [this.http, this.app]
    }

    /**
     * Init server route.
     * 
     */
    initRoute() {
        this.app.get(express.json())
        this.app.use(express.static(path.join(__dirname, './public')))

        this.app.set('view engine', 'pug')
        this.app.set('trust proxy', true)
        this.app.set('views', path.join(__dirname, './views'))

        this.app.use(setHeaders)
        this.app.use('/', web)
        this.app.use(isBrowserReady)
        this.app.use('/api', api)
    }
}

module.exports = new Server