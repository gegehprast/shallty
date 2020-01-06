const Browser = require('../services/Browser')
const Oploverz = new (require('../services/Oploverz'))(Browser)

class OploverzController {
    async newReleases(req, res) {
        const anime = await Oploverz.checkOnGoingPage()
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
        const episodes = await Oploverz.episodes(req.query.link)
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
        const links = await Oploverz.getDownloadLinks(req.query.link)
        if (links.error) {
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

    async shortlink(req, res) {
        const hexa = await Oploverz.hexa(req.query.link)
        if (hexa.error) {
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