const Samehadaku = require('../../fansubs/Samehadaku')
const Util = require('../../utils/utils')

class SamehadakuController {
    async animeList(req, res) {
        const anime = await Samehadaku.animeList()
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
        const episodes = await Samehadaku.episodes(req.query.link)
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
        const anime = await Samehadaku.newReleases()
        const animeArr = [], checkNewReleases = []

        for (let i = 2; i < 8; i++) {
            checkNewReleases.push(Samehadaku.newReleases(i))
        }

        await Promise.all(checkNewReleases)
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
}

module.exports = new SamehadakuController