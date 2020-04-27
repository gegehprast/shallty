const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { moenime_url } = require('../config.json')

class Moenime {
    /**
     * Get anime list from anime list page.
     * 
     * @param {String} show Show type, could be: movie, ongoing or, all.
     */
    async animeList(show = 'all') {
        const page = await Browser.newOptimizedPage()

        try {
            const anime = []
            await page.goto(moenime_url + '/daftar-anime-baru/')

            const nyaalist = await Browser.$$waitAndGet(page, `div.tab-content #${show} a.nyaalist`)
            await Util.asyncForEach(nyaalist, async (anchor) => {
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const link = await Browser.getPlainProperty(anchor, 'href')

                anime.push({
                    title: title,
                    link: link.replace(moenime_url, ''),
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
     * Get episodes with links from ongoing anime page.
     * 
     * @param {String} link Anime page url.
     */
    async episodes(link) {
        const page = await Browser.newOptimizedPage()

        try {
            let episodes = {}
            link = decodeURIComponent(link)
            await page.goto(moenime_url + link)

            const tRowsHandle = await Browser.$$waitAndGet(page, 'tr[bgcolor="#eee"]')
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
                if (!Util.isUndefined(alpha) && !Util.isUndefined(files)) {
                    episodes[alpha] = episodes[alpha] ? episodes[alpha].concat(files) : files
                }
            })

            if (Util.isEmpty(episodes)) {
                return this.movieEpisodes(page)
            }

            await page.close()

            return episodes
        } catch (error) {
            if (error.message.includes('table.$eval is not a function')) {
                return this.completedEpisodes(page)
            }

            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Get episodes from completed anime page.
     * 
     * @param {String} link Anime page url.
     */
    async completedEpisodes(page) {
        try {
            const episodes = {}

            const moeDlLinks = await Browser.$$waitAndGet(page, 'div.moe-dl-link')
            await Util.asyncForEach(moeDlLinks, async (moeDlLink) => {
                const quality = await moeDlLink.$eval('div.tombol', nodes => nodes.innerText)
                if (!quality.toLowerCase().includes('batch')) {
                    const episodeRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr:not([bgcolor="#eee"])')
                    const dlLinkRows = await moeDlLink.$$('div.isi-dl > table > tbody > tr[bgcolor="#eee"]')
                    await Util.asyncForEach(episodeRows, async (episodeDiv, i) => {
                        const { alpha, files } = await this.parseCompletedEpisodeFiles(quality, episodeDiv, dlLinkRows[i])
                        if (!Util.isUndefined(alpha) && !Util.isUndefined(files)) {
                            episodes[alpha] = episodes[alpha] ? episodes[alpha].concat(files) : files
                        }
                    })
                } else {
                    const episodeRows = await moeDlLink.$$('div.isi-dl > table')
                    await Util.asyncForEach(episodeRows, async (episodeDiv) => {
                        const files = await this.parseBatchEpisodeFiles(episodeDiv)
                        if (!Util.isUndefined(files)) {
                            episodes.batch = episodes.batch ? episodes.batch.concat(files) : files
                        }
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

    async movieEpisodes(page) {
        try {
            const episodes = {}

            const tRowsHandle = await Browser.$$waitAndGet(page, 'tr[bgcolor="#eee"]')
            await Util.asyncForEach(tRowsHandle, async tRowHandle => {
                // search for previous sibling tr element
                let trQualityhandle = await page.evaluateHandle(tRow => {
                    return tRow.previousElementSibling
                }, tRowHandle)

                const files = await this.parseMovieEpisodeFiles(trQualityhandle, tRowHandle)
                if (!Util.isUndefined(files)) {
                    episodes.movie = episodes.movie ? episodes.movie.concat(files) : files
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
        const page = await Browser.newOptimizedPage()

        try {
            const anime = []
            await page.goto(moenime_url + '/tag/ongoing/')

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
                    link: info.link.replace(moenime_url, '').replace(/\/+$/, ''),
                    raw_link: info.link
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
     * Parse files of an episode.
     * 
     * @param {ElementHandle} page ElementHandle.
     * @param {ElementHandle} table ElementHandle.
     * @param {ElementHandle} tRow ElementHandle.
     */
    async parseOngoingEpisodeFiles(page, table, tRow) {
        const files = []
        let episode = await table.$eval('center', node => node.innerText)
        const matches = episode.match(/Episode ([0-9])+/gi)
        if (!matches)
            return {}

        const alpha = matches[0].replace(/\s|-/g, '_').toLowerCase()
        const qualityHandle = await page.evaluateHandle(tRow => tRow.previousElementSibling, tRow)
        const quality = await Browser.getPlainProperty(qualityHandle, 'innerText')

        const anchors = await tRow.$$('a')
        await Util.asyncForEach(anchors, async anchor => {
            const host = await Browser.getPlainProperty(anchor, 'innerText')
            const link = await Browser.getPlainProperty(anchor, 'href')

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
            const host = await Browser.getPlainProperty(anchor, 'innerText')
            const link = await Browser.getPlainProperty(anchor, 'href')

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
            const host = await Browser.getPlainProperty(anchor, 'innerText')
            const link = await Browser.getPlainProperty(anchor, 'href')

            files.push({
                quality: quality.replace(' | ', ' - '),
                host: host,
                link: link
            })
        })

        return files
    }

    /**
     * Parse files of a completed episode.
     * 
     * @param {String} quality Episode quality.
     * @param {ElementHandle} episodeDiv ElementHandle.
     * @param {ElementHandle} dlLinkRow ElementHandle.
     */
    async parseMovieEpisodeFiles(qualityTrow, filesTRow) {
        const files = []
        const quality = await Browser.getPlainProperty(qualityTrow, 'innerText')

        const anchors = await filesTRow.$$('a')
        await Util.asyncForEach(anchors, async anchor => {
            const host = await Browser.getPlainProperty(anchor, 'innerText')
            const link = await Browser.getPlainProperty(anchor, 'href')

            files.push({
                quality: quality,
                host: host,
                link: link
            })
        })

        return files
    }
}

module.exports = new Moenime