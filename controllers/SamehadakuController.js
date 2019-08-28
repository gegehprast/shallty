const Samehadaku = require('../services/Samehadaku')
const SamehadakuEas = require('../services/SamehadakuEas')

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
    const anime = await SamehadakuEas.checkOnGoingPage()
    if (!anime) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
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