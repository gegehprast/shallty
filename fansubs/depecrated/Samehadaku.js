const Browser = require('../../Browser')
const Util = require('../../utils/utils')
const Handler = require('../../exceptions/Handler')
const { samehadaku_url } = require('../../config.json')

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
                const matches = rawLink.match(/(?<=episode-)(\d+)/gi)
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
            const episodeList = await Browser.$$waitAndGet(page, 'div.episodelist > ul > li')
            await Util.asyncForEach(episodeList, async (item) => {
                const anchor = await item.$('span.lefttitle > a')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(samehadaku_url, '')
                let episode = link

                if (!link.match(/(opening)/) && !link.match(/(ending)/)) {
                    const episodeMatches = link.match(/(?<=episode-)([\d-]+)/g)
                    const ovaMatches = link.match(/-ova/)
                    const ovaMatches2 = link.match(/ova-/)

                    if (episodeMatches && episodeMatches != null) {
                        episode = episodeMatches[0].length == 1 ? '0' + episodeMatches[0] : episodeMatches[0]
                    } else if ((ovaMatches && ovaMatches != null) || (ovaMatches2 && ovaMatches2 != null)) {
                        episode = await Browser.getPlainProperty(anchor, 'innerText')
                    }

                    episodes.push({
                        episode: episode,
                        link: link,
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
     * Parse download links from episode page of a title.
     * @param link episode page.
     */
    async links(link) {
        const page = await Browser.newOptimizedPage()
        const downloadLinks = []

        try {
            link = decodeURIComponent(link)
            await page.goto(samehadaku_url + link)
            
            await page.waitForSelector('div.download-eps')
            const downloadDivs = await page.$$('div.download-eps')
            await Util.asyncForEach(downloadDivs, async downloadDiv => {
                const p = await page.evaluateHandle(node => node.previousElementSibling, downloadDiv)
                let format = await Browser.getPlainProperty(p, 'innerText')
                format = format.replace('</b>', '')
                    .replace('</b>', '')
                    .replace(/(&amp;)/, '')

                if (format.match(/(3gp)/i)) {
                    return false
                } else if (format.match(/(MKV)/i)) {
                    format = 'MKV'
                } else if (format.match(/(265)/i)) {
                    format = 'x265'
                } else if (format.match(/(MP4)/i)) {
                    format = 'MP4'
                }

                const list = await downloadDiv.$$('li')
                await Util.asyncForEach(list, async item => {
                    const strong = await item.$('strong')
                    if (strong && strong != null) {
                        const quality = await Browser.getPlainProperty(strong, 'innerText')
                        const anchors = await item.$$('a')
                        await Util.asyncForEach(anchors, async anchor => {
                            const host = await Browser.getPlainProperty(anchor, 'innerText')
                            const link = await Browser.getPlainProperty(anchor, 'href')

                            downloadLinks.push({
                                quality: (`${format} ${quality}`).trim(),
                                host: host,
                                link: link
                            })
                        })
                    }
                })
            })

            await page.close()

            return downloadLinks
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Samehadaku