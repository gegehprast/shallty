const Fanscan = require('../../Fanscans')
const Util = require('../../utils/utils')

class FanscanController {
    async mangaList(req, res) {
        const data = await Fanscan.mangaList(Util.ucfirst(req.params.fanscan))

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
        const data = await Fanscan.mangaInfo(Util.ucfirst(req.params.fanscan), req.query.link)

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
        const data = await Fanscan.chapters(Util.ucfirst(req.params.fanscan), req.query.link)

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
        const data = await Fanscan.images(Util.ucfirst(req.params.fanscan))

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
        const data = await Fanscan.newReleases(Util.ucfirst(req.params.fanscan))

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