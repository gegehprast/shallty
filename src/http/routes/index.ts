import express from 'express'
import ParserController from '../controllers/ParserController'
const api = express.Router()

api.get('/parse', ParserController.index)

export default api
