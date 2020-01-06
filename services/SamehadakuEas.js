const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { samehadaku_url } = require('../config.json')

class Samehadaku {
    constructor(browser) {
        this.browser = browser
    }

    async checkOnGoingPage(navPage = 1) {
        const anime = []
        const page = await this.browser.newOptimizedPage()

        try {
            await page.goto(`${samehadaku_url}/page/${navPage}/`, {
                timeout: 300000
            })

            await page.waitForSelector('div.white.updateanime')

            const posts = await page.$$('div.white.updateanime > ul > li')
            await Util.asyncForEach(posts, async (post) => {
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
            await page.close()

            return Handler.error(error)
        }
    }

    async getEpisodes(link) {
        const episodes = []
        const page = await this.browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            link = link.replace('/category/', '/anime/')
            await page.goto(samehadaku_url + link, {
                timeout: 300000
            })
            await page.waitForSelector('div.episodelist')
            const episodeList = await page.$$('div.episodelist > ul > li')
            await Util.asyncForEach(episodeList, async (item) => {
                const anchor = await item.$('span.lefttitle > a')
                const title = await this.browser.getPlainProperty(anchor, 'innerText')
                const link = await this.browser.getPlainProperty(anchor, 'href')

                if (!link.match(/(opening)/) && !link.match(/(ending)/)) {
                    const episodeMatches = link.match(/(?<=episode-)(\d+)/)
                    const ovaMatches = link.match(/-ova/)
                    const ovaMatches2 = link.match(/ova-/)

                    if (episodeMatches && episodeMatches != null) {
                        const numeral = episodeMatches[0].length == 1 ? '0' + episodeMatches[0] : episodeMatches[0]

                        episodes.push({
                            episode: numeral,
                            title: title,
                            link: link
                        })
                    } else if ((ovaMatches && ovaMatches != null) || (ovaMatches2 && ovaMatches2 != null)) {
                        episodes.push({
                            episode: `${title}`,
                            title: title,
                            link: link
                        })
                    }
                }
            })
            await page.close()

            return episodes
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = Samehadaku