const Fanscan = require('../../Fanscans')

class FanscanController {
    async mangaList(req, res) {
        const data = await Fanscan.mangaList(req.params.fanscan, req.query)

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

    async mangaInfo(req, res) {
        const data = await Fanscan.mangaInfo(req.params.fanscan, req.query.link, req.query)

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

    async chapters(req, res) {
        const data = await Fanscan.chapters(req.params.fanscan, req.query.link, req.query)

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

    async images(req, res) {
        const data = await Fanscan.images(req.params.fanscan, req.query)

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
        const data = await Fanscan.newReleases(req.params.fanscan, req.query)

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

module.exports = new FanscanController