const Browser = require('../Browser')
const Util = require('../utils/utils')

class ScreenshotController {
    async screenshot(req, res) {
        const link = decodeURIComponent(req.query.link)
        const page = await Browser.newPage()

        await page.goto(link, {
            timeout: 300000
        })

        await Util.sleep(5000)

        const name = Util.randomString(30) + '.png'
        await page.screenshot({
            path: 'static/screenshot/' + name,
            fullPage: true
        })

        res.json({
            status: 200,
            message: 'Success',
            data: '/screenshot/' + name
        })
    }
}

module.exports = new ScreenshotController