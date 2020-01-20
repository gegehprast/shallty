const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')
const Coeg = require('./Coeg')

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

            if (this.isIncludeCoeg(url)) {
                return Coeg.parse(url)
            }

            if (!url.includes('ahexa') && !url.includes('anjay')) {
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
                const decoded = Util.base64Decode(queries.r)
                if (this.isIncludeCoeg(decoded)) {
                    return Coeg.parse(decoded)
                }

                return {
                    url: decoded
                }
            }

            if (this.isIncludeCoeg(raw)) {
                return Coeg.parse(raw)
            }

            return {
                url: raw
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    isIncludeCoeg(url) {
        for (const marker of Coeg.marker) {
            if (url.includes(marker)) {
                return true
            }
        }

        return false
    }
}

module.exports = new Ahexa