const Oploverz = require('../services/Oploverz')

// eslint-disable-next-line no-unused-vars
const checkOnGoingPage = async (req, res) => {
    const anime = await Oploverz.checkOnGoingPage()
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

const series = async (req, res) => {
    const episodes = await Oploverz.series(req.query.link)
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

const getDownloadLinks = async (req, res) => {
    const links = await Oploverz.getDownloadLinks(req.query.link)
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

const hexa = async (req, res) => {
    const hexa = await Oploverz.hexa(req.query.link)
    if (!hexa) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: hexa
        })
    }
}

module.exports = {
    checkOnGoingPage,
    series,
    getDownloadLinks,
    hexa
}