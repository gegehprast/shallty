const Neonime = require('../services/Neonime')

// eslint-disable-next-line no-unused-vars
const checkOnGoingPage = async (req, res) => {
    const anime = await Neonime.checkOnGoingPage()
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

const animeList = async (req, res) => {
    const anime = await Neonime.animeList(req.query.link)
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

const tvShow = async (req, res) => {
    const episodes = await Neonime.tvShow(req.query.link)
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

const getBatchEpisodes = async (req, res) => {
    const episodes = await Neonime.getBatchEpisodes(req.query.link)
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

const getEpisodes = async (req, res) => {
    const episodes = await Neonime.getEpisodes(req.query.link)
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

const hightech = async (req, res) => {
    const url = await Neonime.hightech(req.query.link)
    if (!url) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: url
        })
    }
}

module.exports = {
    checkOnGoingPage,
    animeList,
    tvShow,
    getBatchEpisodes,
    getEpisodes,
    hightech
}