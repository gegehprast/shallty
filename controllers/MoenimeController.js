const Browser = require('../services/Browser')
const Moenime = new(require('../services/Moenime'))(Browser)

class MoenimeController {
    constructor() {
        this.animeList = this.animeList.bind(this)
    }

    async animeList(req, res) {
        const anime = await Moenime.animeList()
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

module.exports = new MoenimeController