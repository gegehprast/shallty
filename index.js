const Server = require('./server')
const Socket = require('./socket')
const Browser = require('./Browser')
const { app_port, websocket } = require('./config.json')
const runningPort = process.env.PORT || app_port

let appplication = null

;(function () {
    const [http, app] = Server.init(runningPort)

    appplication = app

    if (websocket) {
        Socket.init(http, runningPort)
    }
    
    Server.initRoute()

    Browser.init()
})()

module.exports = appplication