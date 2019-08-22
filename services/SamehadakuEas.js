// eslint-disable-next-line no-unused-vars
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { samehadaku_url } = require('../config.json')

class Samehadaku {
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(samehadaku_url, {
                timeout: 30000
            })

            await page.waitForSelector('div.white.updateanime')

            const posts = await page.$$('div.white.updateanime > ul > li')
            await Util.asyncForEach(posts, async (post, index) => {
                const titleHeader = await post.$('h2.entry-title')
                const { title, link } = await titleHeader.$eval('a', node => ({
                    title: node.innerText,
                    link: node.href
                }))

                const parsedTitle = title.split(' Episode')[0]
                const matches = link.match(/(?<=episode-)(\d+)/)
                if (matches && matches != null) {
                    const numeral = matches[0].length == 1 ? '0' + matches[0] : matches[0]

                    anime.push({
                        episode: numeral,
                        title: parsedTitle,
                        link: link
                    })
                }
            })

            await page.close()

            return anime
        } catch (error) {
            console.log(error)
            await page.close()

            return false
        }
    }
}

module.exports = new Samehadaku