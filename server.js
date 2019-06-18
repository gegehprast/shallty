const express = require('express')
const routes = require('./routes')
const app = express()
const Browser = require('./services/Browser')

app.get(express.json())

app.get('/', async function (req, res) {
    res.send('hello world')
})

app.use('/api', routes)

app.listen(process.env.PORT || 8080, async () => {
    await Browser.init()
})

module.exports = {
    app
}