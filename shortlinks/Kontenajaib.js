const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Kontenajaib {
    constructor() {
        this.marker = 'kontenajaib'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()
        let newPage = null, finalPage = null

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Util.sleep(9500)
            await page.click('#generater')
            await Util.sleep(9500)
            await page.click('#showlink')

            const newPage = await Browser.getNewTabPage(page)
            await Util.sleep(9500)
            await newPage.click('#generater')
            await Util.sleep(9500)
            await newPage.click('#showlink')

            const finalPage = await Browser.getNewTabPage(newPage)
            await Util.sleep(2000)
            const url = finalPage.url()

            await page.close()
            await newPage.close()
            await finalPage.close()

            return {
                url: url
            }
        } catch (error) {
            await page.close()

            if (newPage) {
                await newPage.close()
            }

            if (finalPage) {
                await finalPage.close()
            }

            return Handler.error(error)
        }
    }
}

module.exports = new Kontenajaib