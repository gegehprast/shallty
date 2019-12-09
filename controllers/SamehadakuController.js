const Browser = require('../services/Browser')
const Samehadaku = new (require('../services/Samehadaku'))(Browser)
const SamehadakuEas = new (require('../services/SamehadakuEas'))(Browser)
const Util = require('../utils/utils')

class SamehadakuController {
    async anime(req, res) {
        const episodes = await SamehadakuEas.getEpisodes(req.query.link)
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

    async checkOnGoingPage(req, res) {
        const anime = await SamehadakuEas.checkOnGoingPage()
        const animeArr = [], checkOnGoingPageArr = []

        for (let i = 2; i < 8; i++) {
            checkOnGoingPageArr.push(SamehadakuEas.checkOnGoingPage(i))
        }

        await Promise.all(checkOnGoingPageArr)
            .then(values => {
                for (let i = 2; i < 8; i++) {
                    animeArr[i] = values[i - 2].error ? [] : values[i - 2]
                }
            })

        if (anime.error)
            res.status(500).json({
                status: 500,
                message: anime.message
            })
        
        for (let i = 2; i < 8; i++) {
            await Util.asyncForEach(animeArr[i], item => {
                anime.push(item)
            })
        }

        res.json({
            status: 200,
            message: 'Success',
            data: anime
        })
    }

    async getDownloadLinks(req, res) {
        const links = await Samehadaku.getDownloadLinks(req.query.link)
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

    async tetew(req, res) {
        const tetew = await Samehadaku.anjay(req.query.link)
        if (tetew.error) {
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
        if (njiir.error) {
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