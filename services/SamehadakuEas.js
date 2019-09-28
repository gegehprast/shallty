// eslint-disable-next-line no-unused-vars
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { samehadaku_url } = require('../config.json')

class Samehadaku {
    async checkOnGoingPage(navPage = 1) {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(`${samehadaku_url}/page/${navPage}/`, {
                timeout: 300000
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

    async getEpisodes(link) {
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            link = link.replace('/category/', '/anime/')
            await page.goto(link, {
                timeout: 300000
            })
            await page.waitForSelector('div.episodelist')
            const episodeList = await page.$$('div.episodelist > ul > li')
            await Util.asyncForEach(episodeList, async (item, index) => {
                const anchor = await item.$('span.lefttitle > a')
                const title = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

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
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }
}

module.exports = new Samehadaku