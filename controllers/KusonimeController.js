const Browser = require('../services/Browser')
const Kusonime = require('../services/Kusonime')

class KusonimeController {
    async animeList(req, res) {
        const anime = await new Kusonime(Browser).animeList()
        if (anime.error) {
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
        if (posts.error) {
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

    async semrawut(req, res) {
        const semrawut = await new Kusonime(Browser).semrawut(req.query.link)
        if (semrawut.error) {
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