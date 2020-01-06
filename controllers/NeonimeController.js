const Neonime = require('../services/Neonime')

class NeonimeController {
    async newReleases(req, res) {
        const anime = await Neonime.newReleases()
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

    async episodes(req, res) {
        const episodes = await Neonime.episodes(req.query.link)
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

    async links(req, res) {
        const episodes = await Neonime.links(req.query.link)
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

    async shortlink(req, res) {
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