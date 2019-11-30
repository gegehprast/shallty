const Browser = require('../services/Browser')
const Samehadaku = new (require('../services/Samehadaku'))(Browser)
const SamehadakuEas = new (require('../services/SamehadakuEas'))(Browser)
const Util = require('../utils/utils')

class SamehadakuController {
    constructor() {
        this.anime = this.anime.bind(this)
        this.checkOnGoingPage = this.checkOnGoingPage.bind(this)
        this.getDownloadLinks = this.getDownloadLinks.bind(this)
        this.tetew = this.tetew.bind(this)
        this.njiir = this.njiir.bind(this)
    }

    async anime(req, res) {
        const episodes = await SamehadakuEas.getEpisodes(req.query.link)
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

    async checkOnGoingPage(req, res) {
        let anime = await SamehadakuEas.checkOnGoingPage()
        let anime2, anime3, anime4, anime5, anime6, anime7

        await Promise.all([
            SamehadakuEas.checkOnGoingPage(2),
            SamehadakuEas.checkOnGoingPage(3),
            SamehadakuEas.checkOnGoingPage(4),
            SamehadakuEas.checkOnGoingPage(5),
            SamehadakuEas.checkOnGoingPage(6),
            SamehadakuEas.checkOnGoingPage(7)
        ]).then(values => {
            anime2 = values[0]
            anime3 = values[1]
            anime4 = values[2]
            anime5 = values[3]
            anime6 = values[4]
            anime7 = values[5]
        })

        if (!anime) {
            res.status(500).json({
                status: 500,
                message: anime.message
            })
        } else {
            if (anime2) {
                await Util.asyncForEach(anime2, item => {
                    anime.push(item)
                })
            }

            if (anime3) {
                await Util.asyncForEach(anime3, item => {
                    anime.push(item)
                })
            }

            if (anime4) {
                await Util.asyncForEach(anime4, item => {
                    anime.push(item)
                })
            }

            if (anime5) {
                await Util.asyncForEach(anime5, item => {
                    anime.push(item)
                })
            }

            if (anime6) {
                await Util.asyncForEach(anime6, item => {
                    anime.push(item)
                })
            }

            if (anime7) {
                await Util.asyncForEach(anime7, item => {
                    anime.push(item)
                })
            }

            res.json({
                status: 200,
                message: 'Success',
                data: anime
            })
        }
    }

    async getDownloadLinks(req, res) {
        const links = await Samehadaku.getDownloadLinks(req.query.link)
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

    async tetew(req, res) {
        const tetew = await Samehadaku.anjay(req.query.link)
        if (!tetew) {
            res.status(500).json({
                status: 500,
                message: tetew.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: tetew
            })
        }
    }

    async njiir(req, res) {
        const njiir = await Samehadaku.njiir(req.query.link)
        if (!njiir) {
            res.status(500).json({
                status: 500,
                message: njiir.message
            })
        } else {
            res.json({
                status: 200,
                message: 'Success',
                data: njiir
            })
        }
    }
}

module.exports = new SamehadakuController