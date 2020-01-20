const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Siotong {
    constructor() {
        this.marker = 'siotong'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            const anchor = await Browser.$waitAndGet(page, 'div.download-link > a')
            const raw = await Browser.getPlainProperty(anchor, 'href')

            await page.close()

            const queries = Util.getAllUrlParams(raw)
            if (queries.r) {
                const decoded = Util.base64Decode(queries.r)
                if (decoded.includes('coeg') || decoded.includes('siotong')) {
                    return this.parse(decoded)
                }

                return {
                    url: decoded
                }
            }

            return {
                url: link
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Siotong