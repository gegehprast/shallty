const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')

class Shortlink {
    constructor(browser) {
        this.browser = browser
    }

    async teknoku(link) {
        const page = await this.browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await Promise.all([
                page.waitForNavigation({
                    waitUntil: 'domcontentloaded'
                }),
                page.$eval('#srl > form', form => form.submit()),
            ])

            const fullContent = await page.content()
            await page.close()

            // eslint-disable-next-line quotes
            let splitted = fullContent.split("function changeLink(){var a='")
            splitted = splitted[1].split(';window.open')
            splitted = splitted[0].replace(/(['"])+/g, '')

            return {
                url: splitted
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Shortlink