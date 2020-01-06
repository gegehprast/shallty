const Browser = require('../services/Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { samehadaku_url } = require('../config.json')

class Samehadaku {
    /**
     * Parse and get new released episodes.
     * @param navPage Navigation page.
     */
    async newReleases(navPage = 1) {
        const episodes = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(`${samehadaku_url}/page/${navPage}/`)

            const posts = await Browser.$$waitAndGet(page, 'div.white.updateanime > ul > li')
            await Util.asyncForEach(posts, async (post) => {
                const anchor = await post.$('h2.entry-title a')
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')

                const parsedTitle = title.split(' Episode')[0]
                const matches = rawLink.match(/(?<=episode-)(\d+)/)
                if (matches && matches != null) {
                    const numeral = matches[0].length == 1 ? '0' + matches[0] : matches[0]

                    episodes.push({
                        episode: numeral,
                        title: parsedTitle,
                        link: rawLink.replace(samehadaku_url, ''),
                        raw_link: rawLink
                    })
                }
            })

            await page.close()

            return episodes
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse and get anime list.
     */
    async animeList() {
        const animeList = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(samehadaku_url + '/daftar-anime/?list')

            const anchors = await Browser.$$waitAndGet(page, 'div.daftarkartun a.tip')
            await Util.asyncForEach(anchors, async (anchor) => {
                const title = await Browser.getPlainProperty(anchor, 'innerHTML')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')

                animeList.push({
                    title: title,
                    link: rawLink.replace(samehadaku_url, ''),
                    raw_link: rawLink
                })
            })

            await page.close()

            return animeList
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse tv show page and get episodes.
     * @param link tv show page.
     */
    async episodes(link) {
        const episodes = []
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            link = link.replace('/category/', '/anime/')
            await page.goto(samehadaku_url + link)
            await page.waitForSelector('div.episodelist')
            const episodeList = await page.$$('div.episodelist > ul > li')
            await Util.asyncForEach(episodeList, async (item) => {
                const anchor = await item.$('span.lefttitle > a')
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(samehadaku_url, '')

                if (!link.match(/(opening)/) && !link.match(/(ending)/)) {
                    const episodeMatches = link.match(/(?<=episode-)(\d+)/)
                    const ovaMatches = link.match(/-ova/)
                    const ovaMatches2 = link.match(/ova-/)

                    if (episodeMatches && episodeMatches != null) {
                        const numeral = episodeMatches[0].length == 1 ? '0' + episodeMatches[0] : episodeMatches[0]

                        episodes.push({
                            episode: numeral,
                            title: title,
                            link: link,
                            raw_link: rawLink
                        })
                    } else if ((ovaMatches && ovaMatches != null) || (ovaMatches2 && ovaMatches2 != null)) {
                        episodes.push({
                            episode: `${title}`,
                            title: title,
                            link: link,
                            raw_link: rawLink
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

module.exports = new Samehadaku