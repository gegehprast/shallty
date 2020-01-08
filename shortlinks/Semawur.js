const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Semawur {
    constructor() {
        this.marker = 'semawur'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)

        if (Object.entries(params).length > 0 && params.url) {
            return {
                url: decodeURIComponent(params.url).replace(/\++/g, ' ')
            }
        }

        const page = await Browser.newPageWithNewContext()

        try {
            await page.goto(link)

            await page.waitForSelector('#link-view > button')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#link-view > button')
            ])
            await page.waitForSelector('a.get-link')
            await Util.sleep(5000)
            const downloadButton = await page.$('a.get-link')

            let classProp = await Browser.getPlainProperty(downloadButton, 'className')
            do {
                await Util.sleep(5000)
                classProp = await Browser.getPlainProperty(downloadButton, 'className')
            } while (classProp !== 'get-link')

            const downloadLinks = await Browser.getPlainProperty(downloadButton, 'href')

            await Browser.closePage(page)

            return {
                url: downloadLinks
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Semawur