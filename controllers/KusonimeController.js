const Browser = require('../services/Browser')
const Kusonime = require('../services/Kusonime')

class KusonimeController {
    constructor() {
        this.animeList = this.animeList.bind(this)
        this.homePage = this.homePage.bind(this)
        this.getDownloadLinks = this.getDownloadLinks.bind(this)
        this.semrawut = this.semrawut.bind(this)
    }

    async animeList(req, res) {
        const anime = await new Kusonime(Browser).animeList(req.query.link)
        if (!anime) {
            res.status(500).json({
                status: 500,
                message: anime.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: anime
            })
        }
    }

    async homePage(req, res) {
        const posts = await new Kusonime(Browser).homePage(req.query.page)
        if (!posts) {
            res.status(500).json({
                status: 500,
                message: posts.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: posts
            })
        }
    }

    async getDownloadLinks(req, res) {
        const data = await new Kusonime(Browser).getDownloadLinks(req.query.link)
        if (!data) {
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

    async semrawut(req, res) {
        const semrawut = await new Kusonime(Browser).semrawut(req.query.link)
        if (!semrawut) {
            res.status(500).json({
                status: 500,
                message: semrawut.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: semrawut
            })
        }
    }
}

module.exports = new KusonimeController