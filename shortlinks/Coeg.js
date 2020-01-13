const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Coeg {
    constructor() {
        this.marker = 'coeg.in'
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
                return {
                    url: Util.base64Decode(queries.r)
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

module.exports = new Coeg