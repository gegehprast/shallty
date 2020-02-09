const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')

class Neonime {
    constructor() {
        this.marker = 'neonime.org'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(9500)
            await page.click('#generater')
            await Util.sleep(9500)
            await page.click('#showlink')

            const finalPage = await Browser.getNewTabPage(page)
            await Util.sleep(2000)
            const url = finalPage.url()

            await page.close()
            await finalPage.close()

            return {
                url: url
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Neonime