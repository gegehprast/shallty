const path = require('path')
const Browser = require('../../Browser')
const Util = require('../../utils/utils')

class ScreenshotController {
    async screenshot(req, res) {
        const link = decodeURIComponent(req.query.link)
        const page = await Browser.newPage()

        try {
            await page.goto(link, {
                timeout: 300000
            })

            await Util.sleep(5000)

            const name = Util.randomString(30) + '.png'
            await page.screenshot({
                path: path.join(__dirname, '../public/images/screenshot/') + name,
                fullPage: true
            })
            await page.close()

            res.json({
                status: 200,
                message: 'Success',
                data: '/images/screenshot/' + name
            })
        } catch (error) {
            await page.close()

            res.status(500).json({
                status: 500,
                message: 'Something went wrong. ' + error
            })
        }
    }
}

module.exports = new ScreenshotController