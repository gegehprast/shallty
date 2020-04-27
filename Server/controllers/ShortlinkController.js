const Shorlink = require('../../Shortlinks')

class ShortlinkController {
    async index(req, res) {
        const data = await Shorlink.parse(req.query.link)
        if (data.error) {
            res.status(500).json({
                status: 500,
                message: data.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: data
            })
        }
    }
}

module.exports = new ShortlinkController