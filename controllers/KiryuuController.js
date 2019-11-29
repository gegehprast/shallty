const Browser = require('../services/Browser')
const Kiryuu = require('../services/Kiryuu')

class KiryuuController {
    constructor() {
        this.mangaList = this.mangaList.bind(this)
        this.chapters = this.chapters.bind(this)
        this.images = this.images.bind(this)
        this.mangaInfo = this.mangaInfo.bind(this)
        this.newReleases = this.newReleases.bind(this)
    }

    async mangaList(req, res) {
        const manga = await new Kiryuu(Browser.browser).getMangaList()
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
        const result = await new Kiryuu(Browser.browser).getMangaInfo(req.query.link)
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
        const chapters = await new Kiryuu(Browser.browser).getChapters(req.query.link)
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
        const images = await new Kiryuu(Browser.browser).getImages(req.query.link)
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
        const releases = await new Kiryuu(Browser.browser).getNewReleases(req.query.link)
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