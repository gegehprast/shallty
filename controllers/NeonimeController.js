const Browser = require('../services/Browser')
const Neonime = new (require('../services/Neonime'))(Browser)

class NeonimeController {
    async checkOnGoingPage(req, res) {
        const anime = await Neonime.checkOnGoingPage()
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

    async animeList(req, res) {
        const anime = await Neonime.animeList(req.query.link)
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

    async tvShow(req, res) {
        const episodes = await Neonime.tvShow(req.query.link)
        if (episodes.error) {
            res.status(500).json({
                status: 500,
                message: episodes.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: episodes
            })
        }
    }

    async getBatchEpisodes(req, res) {
        const episodes = await Neonime.getBatchEpisodes(req.query.link)
        if (episodes.error) {
            res.status(500).json({
                status: 500,
                message: episodes.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: episodes
            })
        }
    }

    async getEpisodes(req, res) {
        const episodes = await Neonime.getEpisodes(req.query.link)
        if (episodes.error) {
            res.status(500).json({
                status: 500,
                message: episodes.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: episodes
            })
        }
    }

    async hightech(req, res) {
        const url = await Neonime.hightech(req.query.link)
        if (url.error) {
            res.status(500).json({
                status: 500,
                message: url.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: url
            })
        }
    }
}

module.exports = new NeonimeController