const Browser = require('../services/Browser')
const Meownime = new(require('../services/Meownime'))(Browser)

class MeownimeController {
    async anime(req, res) {
        const episodes = await Meownime.getEpisodes(req.query.link)
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

    async movie(req, res) {
        const episodes = await Meownime.getMovieEpisodes(req.query.link)
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

    async davinsurance(req, res) {
        const link = await Meownime.davinsurance(req.query.link)
        if (link.error) {
            res.status(500).json({
                status: 500,
                message: link.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: link
            })
        }
    }

    async meowbox(req, res) {
        const link = await Meownime.meowbox(req.query.link)
        if (link.error) {
            res.status(500).json({
                status: 500,
                message: link.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: link
            })
        }
    }

    async meowdrive(req, res) {
        const link = await Meownime.meowdrive(req.query.link)
        if (link.error) {
            res.status(500).json({
                status: 500,
                message: link.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: link
            })
        }
    }

    async checkOnGoingPage(req, res) {
        const anime = await Meownime.checkOnGoingPage()
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

    async onGoingAnime(req, res) {
        const anime = await Meownime.onGoingAnime(req.query.link)
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
}



module.exports = new MeownimeController