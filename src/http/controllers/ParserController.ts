import { RequestHandler } from 'express'
import ParserManager from '../../parsers/ParserManager'

const index: RequestHandler = async (req, res) => {
    const data = await ParserManager.parse(req.query.link as string, {
        ignoreCache: req.query.ignoreCache ? true : false
    })

    if (data.success) {
        return res.json({
            status: 200,
            message: 'Success',
            data: data
        })
    }

    return res.status(500).json({
        status: 500,
        message: data.error.toString(),
    })
}

export default {
    index
}
