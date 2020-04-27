const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')
const Coeg = require('./Coeg')

class Anjay {
    constructor() {
        this.marker = 'anjay.info'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(13000)
            try {
                await page.waitForSelector('div.to > a')
                await page.click('div.to > a')
            } catch (error) {
                return this.parseAxeha(page)
            }
            
            await page.waitForSelector('#showlink')
            await page.click('#showlink')

            const newPage = await Browser.getNewTabPage(page)
            await page.close()
            await Util.sleep(2000)
            
            return this.parseAxeha(newPage)
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async parseAxeha(page) {
        try {
            await Util.sleep(3000)
            const url = page.url()

            if (url.includes('bucin')) {
                await page.close()

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

module.exports = new Anjay