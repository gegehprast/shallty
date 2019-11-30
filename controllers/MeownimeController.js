const Browser = require('../services/Browser')
const Meownime = new(require('../services/Meownime'))(Browser)

class MeownimeController {
    constructor() {
        this.anime = this.anime.bind(this)
        this.movie = this.movie.bind(this)
        this.davinsurance = this.davinsurance.bind(this)
        this.meowbox = this.meowbox.bind(this)
        this.meowdrive = this.meowdrive.bind(this)
        this.checkOnGoingPage = this.checkOnGoingPage.bind(this)
        this.onGoingAnime = this.onGoingAnime.bind(this)
    }

    async anime(req, res) {
        const episodes = await Meownime.getEpisodes(req.query.link)
        if (!episodes) {
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
        if (!episodes) {
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
        if (!link) {
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
        if (!link) {
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
        if (!link) {
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

    async onGoingAnime(req, res) {
        const anime = await Meownime.onGoingAnime(req.query.link)
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
}



module.exports = new MeownimeController