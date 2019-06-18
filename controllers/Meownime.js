const Meownime = require('../services/Meownime')

// eslint-disable-next-line no-unused-vars
const anime = async (req, res) => {
    const episodes = await Meownime.getEpisodes(req.query.link)
    if (!episodes) {
        res.status(404).send('Something went wrong')
    } else {
        res.json(episodes)
    }
}

const davinsurance = async (req, res) => {
    const link = await Meownime.davinsurance(req.query.link)
    if (!link) {
        res.status(404).send('Something went wrong')
    } else {
        res.json(link)
    }
}

const meowbox = async (req, res) => {
    const link = await Meownime.meowbox(req.query.link)
    if (!link) {
        res.status(404).send('Something went wrong')
    } else {
        res.json(link)
    }
}

module.exports = {
    anime,
    davinsurance,
    meowbox
}