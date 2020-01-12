const express = require('express')
const routes = require('./routes')
const app = express()
const Browser = require('./Browser')
const { app_port } = require('./config.json')
const runningPort = process.env.PORT || app_port

const isBrowserReady = (req, res, next) => {
    if (Browser.browser !== null) {
        next()
    } else {
        res.status(500).json({
            status: 500,
            message: 'Browser is not ready, please try again later.'
        })
    }
}

app.get(express.json())

app.get('/', async (req, res) => {
    res.send(`<p style="font-weight: 600; margin-top: 15px; font-size: 1.25em;">
        Welcome! You can start crawling via "/api" endpoint. 
        See <a href="https://github.com/gegehprast/shallty/blob/master/README.md" target="_blank">https://github.com/gegehprast/shallty/blob/master/README.md</a> for more information.
    </p>`)
})

app.use((req, res, next) => {
    res.set('X-Powered-By', 'Shallty\'s Love')
    res.append('Access-Control-Allow-Origin', ['*'])
    res.append('Access-Control-Allow-Methods', 'GET')
    next()
})

app.use(isBrowserReady)

app.use('/api', routes)

app.listen(runningPort, async () => {
    console.log('\x1b[32m', `[Server Ready] You can access it at http://localhost:${runningPort}`)
    await Browser.init()
})

module.exports = app