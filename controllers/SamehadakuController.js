const Samehadaku = require('../services/Samehadaku')
const SamehadakuEas = require('../services/SamehadakuEas')
const Util = require('../utils/utils')

// eslint-disable-next-line no-unused-vars
const anime = async (req, res) => {
    const episodes = await SamehadakuEas.getEpisodes(req.query.link)
    if (!episodes) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: episodes
        })
    }
}

const checkOnGoingPage = async (req, res) => {
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
    

    console.log(anime, anime2)
    if (!anime) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
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

const getDownloadLinks = async (req, res) => {
    const links = await Samehadaku.getDownloadLinks(req.query.link)
    if (!links) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: links
        })
    }
}

const tetew = async (req, res) => {
    const tetew = await Samehadaku.anjay(req.query.link)
    if (!tetew) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: tetew
        })
    }
}

const njiir = async (req, res) => {
    const njiir = await Samehadaku.njiir(req.query.link)
    if (!njiir) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: njiir
        })
    }
}

module.exports = {
    anime,
    checkOnGoingPage,
    getDownloadLinks,
    tetew,
    njiir
}