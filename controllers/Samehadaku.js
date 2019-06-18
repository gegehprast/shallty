const Samehadaku = require('../services/Samehadaku')

// eslint-disable-next-line no-unused-vars
const njiir = async (req, res) => {
    const njiir = await Samehadaku.njirr(req.query.link)
    if (!njiir)
        res.status(404).send('Something went wrong')

    res.send(njiir)
}

// eslint-disable-next-line no-unused-vars
const test = async (req, res) => {
    res.send('hello world testing')
}

module.exports = {
    njiir,
    test
}