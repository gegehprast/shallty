const Fansub = require('../../Fansubs')

class FansubController {
    async animeList(req, res) {
        const data = await Fansub.animeList(req.params.fansub, req.query)

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
        const data = await Fansub.episodes(req.params.fansub, req.query.link, req.query)

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
        const data = await Fansub.links(req.params.fansub, req.query.link, req.query)

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
        const data = await Fansub.newReleases(req.params.fansub, req.query)

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