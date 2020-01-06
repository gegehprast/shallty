const Samehadaku = require('../services/Samehadaku')
const SamehadakuEas = require('../services/SamehadakuEas')
const Util = require('../utils/utils')

class SamehadakuController {
    async animeList(req, res) {
        const anime = await SamehadakuEas.animeList()
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
        const episodes = await SamehadakuEas.episodes(req.query.link)
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

    async newReleases(req, res) {
        const anime = await SamehadakuEas.newReleases()
        const animeArr = [], checkOnGoingPageArr = []

        for (let i = 2; i < 8; i++) {
            checkOnGoingPageArr.push(SamehadakuEas.newReleases(i))
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

    async links(req, res) {
        const links = await Samehadaku.links(req.query.link)
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
}

module.exports = new SamehadakuController