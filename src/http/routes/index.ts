import express from 'express'
import ParserController from '../controllers/ParserController'
const api = express.Router()

if (process.env.HTTP === 'true') {
    api.get('/parse', ParserController.index)
}

api.get('/parsers', ParserController.parsers)

export default api
