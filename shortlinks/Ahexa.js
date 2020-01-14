const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Ahexa {
    constructor() {
        this.marker = 'ahexa.com'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(3000)
            const url = page.url()

            if (!url.includes('axeha')) {
                await page.close()

                return {
                    url: url
                }
            }

            await page.waitForSelector('div.download-link')
            const div = await page.$('div.download-link')
            const raw = await div.$eval('a', node => node.href)

            await page.close()

            const queries = Util.getAllUrlParams(raw)
            if (queries.r) {
                return {
                    url: Util.base64Decode(queries.r)
                }
            }

            return {
                url: raw
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Ahexa