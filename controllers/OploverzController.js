const Browser = require('../services/Browser')
const Oploverz = new (require('../services/Oploverz'))(Browser)

class OploverzController {
    constructor() {
        this.checkOnGoingPage = this.checkOnGoingPage.bind(this)
        this.series = this.series.bind(this)
        this.getDownloadLinks = this.getDownloadLinks.bind(this)
        this.hexa = this.hexa.bind(this)
    }

    async checkOnGoingPage(req, res) {
        const anime = await Oploverz.checkOnGoingPage()
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

    async series(req, res) {
        const episodes = await Oploverz.series(req.query.link)
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

    async getDownloadLinks(req, res) {
        const links = await Oploverz.getDownloadLinks(req.query.link)
        if (!links) {
            res.status(500).json({
                status: 500,
                message: links.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: links
            })
        }
    }

    async hexa(req, res) {
        const hexa = await Oploverz.hexa(req.query.link)
        if (!hexa) {
            res.status(500).json({
                status: 500,
                message: hexa.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: hexa
            })
        }
    }
}

module.exports = new OploverzController