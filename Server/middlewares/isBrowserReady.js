const Browser = require('../../Browser')

module.exports = (req, res, next) => {
    if (Browser.browser !== null) {
        next()
    } else {
        res.status(500).json({
            status: 500,
            message: 'Browser is not ready, please try again later.'
        })
    }
}