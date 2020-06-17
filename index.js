require('dotenv').config()
const Server = require('./Server')
const Socket = require('./Socket')
const Browser = require('./Browser')

let appplication = null

;(function () {
    const [http, app] = Server.init(process.env.APP_PORT)

    appplication = app

    console.log(process.env.WEBSOCKET)
    if (process.env.WEBSOCKET === 'true') {
        Socket.init(http, process.env.APP_PORT)
    }

    if (process.env.HTTP === 'true') {
        Server.initRoute()
    }
    
    Browser.init()
})()

module.exports = appplication