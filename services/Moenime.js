const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { moenime_url } = require('../config.json')

class Moenime {
    constructor(browser) {
        this.browser = browser
    }

    /**
     * Get anime list from anime list page.
     *
     */
    async animeList(type = 'all') {
        const page = await this.browser.browser.newPage()

        try {
            await page.goto(moenime_url + '/daftar-anime-baru/', {
                timeout: 60000
            })

            await page.waitForSelector('div.tab-content')
            const animeList = await page.$$eval(`div.tab-content #${type} a.nyaalist`, nodes => nodes.map(x => {
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

    /**
     * Parse files of an episode.
     * 
     * @param {String} quality Episode quality.
     * @param {ElementHandle} episodeDiv ElementHandle.
     * @param {ElementHandle} dlLinkRow ElementHandle.
     */
    async parseEpisodeFiles(quality, episodeDiv, dlLinkRow) {
        const files = []
        const episode = await episodeDiv.$eval('td', node => node.innerText)

        const episodeSplit = episode.split(' — ')
        const alpha = episodeSplit[0].replace(/\s|-/g, '_').toLowerCase()
        const size = episodeSplit[1]
        
        const dlLinkAnchors = await dlLinkRow.$$('a')
        await Util.asyncForEach(dlLinkAnchors, async (anchor) => {
            const host = await this.browser.getPlainProperty(anchor, 'innerText')
            const link = await this.browser.getPlainProperty(anchor, 'href')

            files.push({
                quality: `${quality.split(' — ')[1]} - ${size}`,
                host: host,
                link: link
            })
        })

        return {
            alpha: alpha,
            files: files
        }
    }

    /**
     * Parse files of a batch episode.
     * 
     * @param {ElementHandle} episodeDiv ElementHandle.
     */
    async parseBatchEpisodeFiles(episodeDiv) {
        const files = []
        const quality = await episodeDiv.$eval('tr:not([bgcolor="#eee"]', node => node.innerText)
        const dlLinkAnchors = await episodeDiv.$$('tr[bgcolor="#eee"] a')

        await Util.asyncForEach(dlLinkAnchors, async (anchor) => {
            const host = await this.browser.getPlainProperty(anchor, 'innerText')
            const link = await this.browser.getPlainProperty(anchor, 'href')

            files.push({
                quality: quality.replace(' | ', ' - '),
                host: host,
                link: link
            })
        })

        return files
    }

    /**
     * Get episodes from anime page.
     * 
     * @param {String} link Anime page url.
     */
    async episodes(link) {
        const page = await this.browser.browser.newPage()
        const episodes = {}

        try {
            link = decodeURIComponent(link)
            await page.goto(moenime_url + link, {
                timeout: 60000
            })

            await page.waitForSelector('div.moe-dl-link')
            const moeDlLinks = await page.$$('div.moe-dl-link')

            await Util.asyncForEach(moeDlLinks, async (moeDlLink) => {
                const quality = await moeDlLink.$eval('div.tombol', nodes => nodes.innerText)

                if (!quality.toLowerCase().includes('batch')) {
                    const episodeRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr:not([bgcolor="#eee"])')
                    const dlLinkRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr[bgcolor="#eee"]')

                    await Util.asyncForEach(episodeRows, async (episodeDiv, i) => {
                        const { alpha, files } = await this.parseEpisodeFiles(quality, episodeDiv, dlLinkRows[i])

                        episodes[alpha] = episodes[alpha] ? episodes[alpha].concat(files) : files
                    })
                } else {
                    const episodeRows = await moeDlLink.$$('div.isi-dl > table')

                    await Util.asyncForEach(episodeRows, async (episodeDiv) => {
                        const files = await this.parseBatchEpisodeFiles(episodeDiv)

                        episodes.batch = episodes.batch ? episodes.batch.concat(files) : files
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
     * Get new released anime from on goig page.
     *
     */
    async newReleases() {
        const page = await this.browser.browser.newPage()

        try {
            const anime = []
            await page.goto(moenime_url + '/tag/ongoing/', {
                timeout: 60000
            })

            await page.waitForSelector('article')
            const articles = await page.$$('article')
            await Util.asyncForEach(articles, async (article) => {
                const episode = await article.$eval('div > div.postedon', node => node.innerText)
                const info = await article.$eval('div > div.out-thumb > h1 > a', node => {
                    return { title: node.innerText, link: node.href }
                })
                
                anime.push({
                    episode: episode.split(' ')[1],
                    title: info.title,
                    link: info.link.replace(moenime_url, '').replace(/\/+$/, '')
                })
            })

            await page.close()

            return anime
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = Moenime