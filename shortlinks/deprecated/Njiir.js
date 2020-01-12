const Browser = require('../../Browser')
const Handler = require('../../exceptions/Handler')
const Util = require('../../utils/utils')

class Njiir {
    constructor() {
        this.marker = 'njiir'
    }

    async parse(link) {
        const page = await Browser.newOptimizedPage()

        try {
            let downloadLink, anchor
            link = decodeURIComponent(link)
            await page.goto(link)

            await page.waitForSelector('div.result > a')
            await Util.sleep(8000)
            anchor = await page.$('div.result > a')
            downloadLink = await Browser.getPlainProperty(anchor, 'href')
            if (downloadLink == 'javascript:' || downloadLink.includes('javascript') == true) {
                await anchor.click()
            }
            await Util.sleep(5000)
            anchor = await page.$('div.result > a')
            downloadLink = await Browser.getPlainProperty(anchor, 'href')
            await page.close()

            return {
                url: downloadLink
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Njiir