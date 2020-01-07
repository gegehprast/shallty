const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')

class Anjay {
    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            if (link.includes('ahexa.')) {
                return this.tetew(link, true)
            }

            await page.goto(link)

            await Util.sleep(13000)
            await page.waitForSelector('div.to > a')
            await page.click('div.to > a')
            await page.waitForSelector('#showlink')
            await page.click('#showlink')

            const newPage = await Browser.newTabPagePromise(page)
            await Util.sleep(2000)
            const url = newPage.url()

            await page.close()
            await newPage.close()

            const final = this.tetew(url, true)

            return final
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Anjay