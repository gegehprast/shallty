import express from 'express'
import api from './routes'

const init = () => {
    const app = express()

    app.use(express.json())
    app.use(express.urlencoded({
        extended: true
    }))

    app.get('/', (req, res) => {
        res.send('Hello world!')
    })

    app.use('/api', api)

    app.listen(process.env.APP_PORT || 3000, () => console.log('Server started!'))
}

export default init
