const express = require('express')
const path = require('path')
const routes = require('./routes')
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

        this.app.get('/', async (req, res) => {
            res.send(`<p style="font-weight: 600; margin-top: 15px; font-size: 1.25em;">
                Welcome! You can start crawling via "/api" endpoint. 
                See <a href="https://github.com/gegehprast/shallty/blob/master/README.md" target="_blank">https://github.com/gegehprast/shallty/blob/master/README.md</a> for more information.
            </p>`)
        })

        this.app.use(setHeaders)

        this.app.use(isBrowserReady)

        this.app.use(express.static(path.join(__dirname, '/static')))

        this.app.use('/api', routes)
    }
}

module.exports = new Server()