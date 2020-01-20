const Browser = require('../Browser')
const Handler = require('../exceptions/Handler')
const Util = require('../utils/utils')

class Hightech {
    constructor() {
        this.marker = 'hightech'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)
        if (params.sitex) {
            return {
                url: Util.base64Decode(params.sitex)
            }
        }

        if (params.xyzkl) {
            return {
                url: Util.base64Decode(params.xyzkl)
            }
        }

        const page = await Browser.newPageWithNewContext()

        try {
            await page.goto(link)

            const xyzklCookie = await Browser.getCookie(page, 'xyzkl')

            if (xyzklCookie && xyzklCookie.value) {
                await page.close()
                
                return {
                    url: Util.base64Decode(xyzklCookie.value)
                }
            }

            await Util.sleep(8000)
            await page.waitForSelector('a[href="#generate"]')
            await page.click('a[href="#generate"]')
            await page.waitForSelector('a#link-download')
            await Util.sleep(4000)
            await page.click('a#link-download')

            const newPage = await Browser.getNewTabPage(page)
            await Util.sleep(2000)
            const url = newPage.url()

            await page.close()
            await newPage.close()

            return {
                url: url
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Hightech