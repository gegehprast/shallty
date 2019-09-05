const Kusonime = require('../services/Kusonime')

const animeList = async (req, res) => {
    const anime = await Kusonime.animeList(req.query.link)
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
    const data = await Kusonime.getDownloadLinks(req.query.link)
    if (!data) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: data
        })
    }
}

const semrawut = async (req, res) => {
    const semrawut = await Kusonime.semrawut(req.query.link)
    if (!semrawut) {
        res.status(404).json({
            status: 404,
            message: 'Something went wrong'
        })
    } else {
        res.json({
            status: 200,
            message: 'Success',
            data: semrawut
        })
    }
}

module.exports = {
    animeList,
    getDownloadLinks,
    semrawut
}