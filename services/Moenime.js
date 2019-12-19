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
     * @param {String} show Show type, could be: movie, ongoing or, all.
     */
    async animeList(show = 'all') {
        const page = await this.browser.browser.newPage()

        try {
            await page.goto(moenime_url + '/daftar-anime-baru/', {
                timeout: 60000
            })

            await page.waitForSelector('div.tab-content')
            const animeList = await page.$$eval(`div.tab-content #${show} a.nyaalist`, nodes => nodes.map(x => {
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
     * @param {ElementHandle} page ElementHandle.
     * @param {ElementHandle} table ElementHandle.
     * @param {ElementHandle} tRow ElementHandle.
     */
    async parseOngoingEpisodeFiles(page, table, tRow) {
        const files = []
        let episode = await table.$eval('center', node => node.innerText)
        const matches = episode.match(/Episode ([0-9])+/g)
        if (!matches)
            return {}

        const alpha = matches[0].replace(/\s|-/g, '_').toLowerCase()
        const qualityHandle = await page.evaluateHandle(tRow => tRow.previousElementSibling, tRow)
        const quality = await this.browser.getPlainProperty(qualityHandle, 'innerText')

        const anchors = await tRow.$$('a')
        await Util.asyncForEach(anchors, async anchor => {
            const host = await this.browser.getPlainProperty(anchor, 'innerText')
            const link = await this.browser.getPlainProperty(anchor, 'href')

            files.push({
                quality: quality,
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
     * Parse files of a completed episode.
     * 
     * @param {String} quality Episode quality.
     * @param {ElementHandle} episodeDiv ElementHandle.
     * @param {ElementHandle} dlLinkRow ElementHandle.
     */
    async parseCompletedEpisodeFiles(quality, episodeDiv, dlLinkRow) {
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
     * Get episodes from ongoing anime page.
     * 
     * @param {String} link Anime page url.
     */
    async episodes(link) {
        const page = await this.browser.browser.newPage()

        try {
            let episodes = {}
            link = decodeURIComponent(link)
            await page.goto(moenime_url + link, {
                timeout: 60000
            })

            const tRowsHandle = await this.browser.waitAndGetSelectors(page, 'tr[bgcolor="#eee"]')
            await Util.asyncForEach(tRowsHandle, async tRowHandle => {
                // search for previous sibling table element
                let tableHandle = await page.evaluateHandle(tRow => {
                    return tRow.parentElement.previousElementSibling
                }, tRowHandle)
                // search again if table element is null
                if (tableHandle.asElement() == null) {
                    tableHandle = await page.evaluateHandle(tRow => {
                        return tRow.parentElement.parentElement.previousElementSibling
                    }, tRowHandle)
                }

                const { alpha, files } = await this.parseOngoingEpisodeFiles(page, tableHandle, tRowHandle)
                episodes[alpha] = episodes[alpha] ? episodes[alpha].concat(files) : files
            })

            await page.close()

            return episodes
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Get episodes from completed anime page.
     * 
     * @param {String} link Anime page url.
     */
    async completedEpisodes(link) {
        const page = await this.browser.browser.newPage()

        try {
            const episodes = {}
            link = decodeURIComponent(link)
            await page.goto(moenime_url + link, {
                timeout: 60000
            })

            const moeDlLinks = await this.browser.waitAndGetSelectors(page, 'div.moe-dl-link')
            await Util.asyncForEach(moeDlLinks, async (moeDlLink) => {
                const quality = await moeDlLink.$eval('div.tombol', nodes => nodes.innerText)
                if (!quality.toLowerCase().includes('batch')) {
                    const episodeRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr:not([bgcolor="#eee"])')
                    const dlLinkRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr[bgcolor="#eee"]')
                    await Util.asyncForEach(episodeRows, async (episodeDiv, i) => {
                        const { alpha, files } = await this.parseCompletedEpisodeFiles(quality, episodeDiv, dlLinkRows[i])
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

    async teknoku(link) {
        const page = await this.browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 60000
            })

            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#srl > form > input.sorasubmit'),
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

module.exports = Moenime