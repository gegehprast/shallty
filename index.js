const express = require('express')
const routes = require('./routes')
const app = express()
const Browser = require('./services/Browser')
const { app_port } = require('./config.json')
const runningPort = process.env.PORT || app_port

app.get(express.json())

app.get('/', async function (req, res) {
    res.send(`<p style="font-weight: 600; margin-top: 15px; font-size: 1.25em;">
        You can start crawling via "/api" endpoint. 
        See <a href="https://github.com/gegehprast98/shallty/blob/master/README.md" target="_blank">https://github.com/gegehprast98/shallty/blob/master/README.md</a> for more information.
    </p>`)
})

app.use((req, res, next) => {
    res.set('X-Powered-By', 'Shallty\'s Love')
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET')
    next()
})

app.use('/api', routes)

app.listen(runningPort, async () => {
    console.log('\x1b[32m', `[Server Ready] You can access it at http://localhost:${runningPort}`)
    await Browser.init()
})

module.exports = {
    app
}