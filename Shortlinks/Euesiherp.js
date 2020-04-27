const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Euesiherp {
    constructor() {
        this.marker = 'eue.siherp.'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await page.waitForSelector('button#download2')
            await page.click('button#download2')
            await Util.sleep(7000)
            await page.waitForSelector('button#download')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('button#download')
            ])
            const final = page.url()
            await page.close()

            return {
                url: final
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Euesiherp