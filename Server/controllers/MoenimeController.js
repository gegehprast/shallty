const Moenime = require('../../fansubs/Moenime')

class MoenimeController {
    async animeList(req, res) {
        const show = (['ongoing', 'movie'].includes(req.query.show)) ? req.query.show : 'all'
        const anime = await Moenime.animeList(show)
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

    async links(req, res) {
        const episodes = await Moenime.episodes(req.query.link)
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
        const anime = await Moenime.newReleases()
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

module.exports = new MoenimeController