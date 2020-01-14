const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

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
            await page.waitForSelector('div.to > a')
            await page.click('div.to > a')
            await page.waitForSelector('#showlink')
            await page.click('#showlink')

            const newPage = await Browser.getNewTabPage(page)
            await Util.sleep(2000)
            const final = this.parseAxeha(newPage)

            await page.close()

            return final
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async parseAxeha(page) {
        try {
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

module.exports = new Anjay