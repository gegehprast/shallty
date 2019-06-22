const Samehadaku = require('../services/Samehadaku')

// eslint-disable-next-line no-unused-vars
const checkOnGoingPage = async (req, res) => {
    const anime = await Samehadaku.checkOnGoingPage()
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
    const tetew = await Samehadaku.tetew(req.query.link)
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
    checkOnGoingPage,
    getDownloadLinks,
    tetew,
    njiir
}