const Meownime = require('../services/Meownime')

const anime = async (req, res) => {
    const episodes = await Meownime.getEpisodes(req.query.link)
    if (!episodes) {
        res.status(500).json({
            status: 500,
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

const movie = async (req, res) => {
    const episodes = await Meownime.getMovieEpisodes(req.query.link)
    if (!episodes) {
        res.status(500).json({
            status: 500,
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

const davinsurance = async (req, res) => {
    const link = await Meownime.davinsurance(req.query.link)
    if (!link) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: link
        })
    }
}

const meowbox = async (req, res) => {
    const link = await Meownime.meowbox(req.query.link)
    if (!link) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: link
        })
    }
}

const meowdrive = async (req, res) => {
    const link = await Meownime.meowdrive(req.query.link)
    if (!link) {
        res.status(500).json({
            status: 500,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: link
        })
    }
}

const checkOnGoingPage = async (req, res) => {
    const anime = await Meownime.checkOnGoingPage()
    if (!anime) {
        res.status(500).json({
            status: 500,
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

const onGoingAnime = async (req, res) => {
    const anime = await Meownime.onGoingAnime(req.query.link)
    if (!anime) {
        res.status(500).json({
            status: 500,
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

module.exports = {
    anime,
    movie,
    davinsurance,
    meowbox,
    meowdrive,
    checkOnGoingPage,
    onGoingAnime
}