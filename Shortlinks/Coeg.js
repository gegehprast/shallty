const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Coeg {
    constructor() {
        this.marker = [
            'coeg',
            'siotong',
            'telondasmu',
            'greget',
            'siherp',
            'bucin'
        ]
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(3000)
            const currentUrl = page.url()
            let isFinal = true

            for (const marker of this.marker) {
                if (currentUrl.includes(marker)) {
                    isFinal = false
                }
            }

            if (isFinal) {
                await page.close()

                return {
                    url: currentUrl
                }
            }

            const anchor = await Browser.$waitAndGet(page, 'div.download-link > a')
            const raw = await Browser.getPlainProperty(anchor, 'href')

            await page.close()

            const queries = Util.getAllUrlParams(raw)
            if (queries.r) {
                const decoded = Util.base64Decode(queries.r)
                for (const marker of this.marker) {
                    if (decoded.includes(marker)) {
                        return this.parse(decoded)
                    }
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

module.exports = new Coeg