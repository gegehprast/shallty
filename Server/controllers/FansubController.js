const Fansub = require('../../Fansubs')
const Util = require('../../utils/utils')

class FansubController {
    async animeList(req, res) {
        const data = await Fansub.animeList(Util.ucfirst(req.params.fansub))

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

    async episodes(req, res) {
        const data = await Fansub.episodes(Util.ucfirst(req.params.fansub), req.query.link)

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

    async links(req, res) {
        const data = await Fansub.links(Util.ucfirst(req.params.fansub), req.query.link)

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

    async newReleases(req, res) {
        const data = await Fansub.newReleases(Util.ucfirst(req.params.fansub))

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

module.exports = new FansubController