const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Hexa {
    constructor() {
        this.marker = 'hexafile.net'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(7000)
            const anchor = await page.$('center.link-content > a')
            const url = await Browser.getPlainProperty(anchor, 'href')
            await page.close()

            return {
                url: url
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Hexa