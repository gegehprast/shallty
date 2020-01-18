const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { oploverz_url } = require('../config.json')

class Oploverz {
    /**
     * Check on going page and get latest released episodes.
     */
    async newReleases() {
        const anime = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1')
            await page.goto(oploverz_url, {
                timeout: 300000
            })
            
            await Util.sleep(15000)

            const list = await page.$$('#content > div.postbody > div.boxed > div.right > div.lts > ul > li')
            await Util.asyncForEach(list, async item => {
                const anchor = await item.$('div.dtl > h2 > a')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const matchEps = rawLink.match(/(\d+)(?=-subtitle-indonesia)/)
                if (matchEps && matchEps != null) {
                    const numeral = matchEps[0].length == 1 ? '0' + matchEps[0] : matchEps[0]
                    const matchTitles = title.match(/(.+)(?= \d+)/, '')
                    if (matchTitles && matchTitles != null) {
                        const parsedTitle = matchTitles[0].replace(' Episode', '')
                        anime.push({
                            episode: numeral,
                            title: parsedTitle,
                            raw_link: rawLink,
                            link: rawLink.replace(oploverz_url, '')
                        })
                    }
                }
            })

            await page.close()

            return anime
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
            await page.goto(oploverz_url + '/series/')

            const anchors = await Browser.$$waitAndGet(page, 'div.postbody > .movlist> ul > li > a')
            await Util.asyncForEach(anchors, async (anchor) => {
                const title = await Browser.getPlainProperty(anchor, 'innerHTML')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')

                animeList.push({
                    title: title,
                    link: rawLink.replace(oploverz_url, ''),
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
     * Parse series page and get episode list.
     * @param link series page.
     */
    async episodes(link) {
        const episodes = []
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(oploverz_url + link)
            await Util.sleep(15000)
            const list = await page.$$('#content > div.postbody > div > div.episodelist > ul > li')
            await Util.asyncForEach(list, async (item, index) => {
                if (index >= 30) {
                    return false
                }
                
                const anchor = await item.$('span.leftoff > a')
                const episode = await Browser.getPlainProperty(anchor, 'innerText')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(oploverz_url, '')
                const episodeMatches = episode.match(/(?<=episode )([\d-]+)/gi)
                const numeral = episodeMatches[0].length == 1 ? '0' + episodeMatches[0] : episodeMatches[0]

                episodes.push({
                    episode: numeral,
                    link: link,
                    raw_link: rawLink
                })
            })


            await page.close()

            return episodes
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse download links from episode page.
     * @param link episode page.
     */
    async links(link) {
        const page = await Browser.newOptimizedPage()
        const downloadLinks = []

        try {
            link = decodeURIComponent(link)
            await page.goto(oploverz_url + link)

            await Util.sleep(15000)
            
            const soraddls = await page.$$('#op-single-post > div.epsc > div[class="soraddl op-download"]')
            await Util.asyncForEach(soraddls, async soraddl => {
                const sorattls = await soraddl.$$('div[class="sorattl title-download"]')
                const soraurls = await soraddl.$$('div[class="soraurl list-download"]')
                await Util.asyncForEach(soraurls, async (soraurl, index) => {
                    let quality = await Browser.getPlainProperty(sorattls[index], 'innerText')
                    quality = this.parseQuality(quality)

                    const anchors = await soraurl.$$('a')
                    await Util.asyncForEach(anchors, async anchor => {
                        const host = await Browser.getPlainProperty(anchor, 'innerText')
                        const link = await Browser.getPlainProperty(anchor, 'href')

                        downloadLinks.push({
                            quality: quality,
                            host: host,
                            link: link
                        })
                    })
                })
            })

            await page.close()

            return downloadLinks
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    parseQuality(quality) {
        let result = ''

        if (quality.match(/(x265)/i)) {
            result += 'x265'
        } else if (quality.match(/(MKV)/i)) {
            result += 'MKV'
        } else {
            result += 'MP4'
        }

        if (quality.match(/(1080p)/i)) {
            result += ' 1080p'
        } else if (quality.match(/(720p)/i)) {
            result += ' 720p'
        } else if (quality.match(/(480p)/i)) {
            result += ' 480p'
        }

        if (quality.match(/(10bit)/i)) {
            result += ' 10bit'
        }

        return result
    }
}

module.exports = new Oploverz