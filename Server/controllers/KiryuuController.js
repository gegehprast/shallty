const Kiryuu = require('../../fantls/Kiryuu')

class KiryuuController {
    async mangaList(req, res) {
        const manga = await Kiryuu.mangaList()
        if (manga.error) {
            res.status(500).json({
                status: 500,
                message: manga.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: manga
            })
        }
    }

    async mangaInfo(req, res) {
        const result = await Kiryuu.mangaInfo(req.query.link)
        if (result.error) {
            res.status(500).json({
                status: 500,
                message: result.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: result
            })
        }
    }

    async chapters(req, res) {
        const chapters = await Kiryuu.chapters(req.query.link)
        if (chapters.error) {
            res.status(500).json({
                status: 500,
                message: chapters.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: chapters
            })
        }
    }

    async images(req, res) {
        const images = await Kiryuu.images(req.query.link)
        if (images.error) {
            res.status(500).json({
                status: 500,
                message: images.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: images
            })
        }
    }

    async newReleases(req, res) {
        const releases = await Kiryuu.newReleases()
        if (releases.error) {
            res.status(500).json({
                status: 500,
                message: releases.message,
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: releases
            })
        }
    }
}

module.exports = new KiryuuController