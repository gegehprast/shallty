const Browser = require('../../Browser')
const Handler = require('../../exceptions/Handler')
const Util = require('../../utils/utils')

class Tetew {
    async parse(link, skip = false) {
        let final
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await page.waitForSelector('div.download-link')
            const div = await page.$('div.download-link')
            const untetewed = await div.$eval('a', node => node.href)

            if (skip) {
                await page.close()
                return this.parseTetewBase64UrlParam(untetewed)
            }

            // njiir
            const unjiired = await this.njiir(encodeURI(untetewed))
            if (unjiired != false) {
                await page.close()

                return {
                    url: unjiired.url
                }
            }

            // eue
            const uneue = await this.eueSiherp(encodeURI(untetewed))
            if (uneue != false) {
                await page.close()

                return {
                    url: uneue.url
                }
            }

            await page.goto(untetewed)
            try {
                await page.waitForSelector('div.download-link')
                const div2 = await page.$('div.download-link')
                const untetewed2 = await div2.$eval('a', node => node.href)
                await page.goto(untetewed2)
                final = page.url()
                await page.close()
            } catch (e) {
                console.log(e)
                await page.close()
                return this.parseTetewBase64UrlParam(untetewed)
            }

            return {
                url: final
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async parseTetewBase64UrlParam(untetewed) {
        const queries = Util.getAllUrlParams(untetewed)
        if (queries.r) {
            return {
                url: Util.base64Decode(queries.r)
            }
        }
        return {
            url: untetewed
        }
    }
}

module.exports = new Tetew