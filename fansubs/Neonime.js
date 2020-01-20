const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { neonime_url } = require('../config.json')

class Neonime {
    /**
     * Parse and get new released episodes.
     */
    async newReleases() {
        const anime = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(neonime_url + '/episode/')

            const tRows = await Browser.$$waitAndGet(page, 'table.list tbody > tr')
            await Util.asyncForEach(tRows, async (trow) => {
                const anchor = await trow.$('td.bb > a')
                const text = await Browser.getPlainProperty(anchor, 'innerText')
                const link = await Browser.getPlainProperty(anchor, 'href')
                const epsSplit = text.split(' Episode ')
                const episode = epsSplit[epsSplit.length - 1]
                const numeral = episode.length == 1 ? '0' + episode : episode
                const title = text.split(' Subtitle')[0]

                anime.push({
                    episode: numeral,
                    title: title,
                    link: link.replace(neonime_url, ''),
                    raw_link: link
                })
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
            await page.goto(neonime_url + '/list-anime/')
            
            const anchors = await Browser.$$waitAndGet(page, '#az-slider a')
            await Util.asyncForEach(anchors, async (anchor) => {
                const title = await Browser.getPlainProperty(anchor, 'innerHTML')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(neonime_url, '')

                animeList.push({
                    title: title.trim(),
                    link: link,
                    raw_link: rawLink,
                    is_batch: link.startsWith('/batch')
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
            
            if (link.startsWith('/batch')) {
                return this.parseBatchLinks(link)
            }

            await page.goto(neonime_url + link)

            await page.waitForSelector('div.episodiotitle')
            const episodios = await page.$$('div.episodiotitle')
            await Util.asyncForEach(episodios, async episodio => {
                const anchor = await episodio.$('a')
                const episode = await Browser.getPlainProperty(anchor, 'innerHTML')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(neonime_url, '')
                const episodeMatches = episode.match(/(?<=episode )([\d-]+)/gi)
                const numeral = episodeMatches[0].length == 1 ? '0' + episodeMatches[0] : episodeMatches[0]

                episodes.push({
                    episode: numeral.trim(),
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
     * Parse episode page and get download links.
     * @param link episode page.
     */
    async links(link) {
        link = decodeURIComponent(link)

        if (link.startsWith('/batch')) {
            return this.parseBatchLinks(link)
        }

        return this.parseLinks(link)
    }

    /**
     * Parse episode page and get download links.
     * @param link episode page.
     */
    async parseLinks(link) {
        const links = []
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(neonime_url + link)

            await page.waitForSelector('div.central > div > ul > ul')
            const list = await page.$$('div > ul > ul')
            await Util.asyncForEach(list, async item => {
                const quality = await item.$eval('label', node => node.innerText)
                const anchors = await item.$$('a')
                await Util.asyncForEach(anchors, async anchor => {
                    const host = await Browser.getPlainProperty(anchor, 'innerText')
                    const link = await Browser.getPlainProperty(anchor, 'href')

                    if (link != neonime_url && !host.toLowerCase().includes('proses')) {
                        links.push({
                            quality: quality.trim(),
                            host: host,
                            link: link
                        })
                    }
                })
            })
            
            await page.close()

            return links
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse batch episode page and get download links.
     * @param link episode page.
     */
    async parseBatchLinks(link) {
        let isInfoOne = false
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(neonime_url + link)
            
            await page.waitForSelector('.smokeurl').catch(e => {
                Handler.error(e)
                isInfoOne = true
            })

            const links = !isInfoOne ? await this.parseSmokeUrl(page) : await this.parseInfoOne(page)
            
            await page.close()

            return links
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse batch episode page that using info1 element.
     * @param page episode page instance.
     */
    async parseInfoOne(page) {
        const links = []
        await page.waitForSelector('p[data-id="info1"]').catch(async e => {
            await page.close()

            return Handler.error(e)
        })
        const smokeurls = await page.$$('p[data-id="info1"]')
        await Util.asyncForEach(smokeurls, async smokeurl => {
            const strong = await smokeurl.$('strong')
            if (strong && strong != null) {
                const quality = await smokeurl.$eval('strong', node => node.innerText)
                const anchors = await smokeurl.$$('a')
                await Util.asyncForEach(anchors, async anchor => {
                    const host = await Browser.getPlainProperty(anchor, 'innerText')
                    const link = await Browser.getPlainProperty(anchor, 'href')

                    links.push({
                        quality: quality.trim(),
                        host: host,
                        link: link
                    })
                })
            }
        })

        return links
    }

    /**
     * Parse batch episode page that using smokeurl element.
     * @param page episode page instance.
     */
    async parseSmokeUrl(page) {
        const links = []
        const smokeurls = await page.$$('.smokeurl')
        await Util.asyncForEach(smokeurls, async smokeurl => {
            const quality = await smokeurl.$eval('strong', node => node.innerText)
            const anchors = await smokeurl.$$('a')
            await Util.asyncForEach(anchors, async anchor => {
                const host = await Browser.getPlainProperty(anchor, 'innerText')
                const link = await Browser.getPlainProperty(anchor, 'href')

                links.push({
                    quality: quality.trim(),
                    host: host,
                    link: link
                })
            })
        })

        return links
    }
}

module.exports = new Neonime