import { RequestHandler } from 'express'

const setHeaders: RequestHandler = (req, res, next) => {
    res.set('X-Powered-By', 'Shallty\'s Love')
    res.append('Access-Control-Allow-Origin', ['http://localhost:8080'])
    res.append('Access-Control-Allow-Credentials', 'true')
    res.append('Access-Control-Allow-Methods', 'GET')
    next()
}

export default setHeaders
