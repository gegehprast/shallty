// const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { moenime_url } = require('../config.json')

class Moenime {
    constructor(browser) {
        this.browser = browser
    }

    async animeList() {
        const page = await this.browser.browser.newPage()

        try {
            await page.goto(moenime_url + '/daftar-anime-baru/', {
                timeout: 60000
            })

            await page.waitForSelector('div.tab-content a.nyaalist')
            const animeList = await page.$$eval('div.tab-content a.nyaalist', nodes => nodes.map(x => {
                const title = x.innerText
                const link = x.href

                return {
                    link: link,
                    title: title
                }
            }))
            await page.close()

            return animeList
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = Moenime