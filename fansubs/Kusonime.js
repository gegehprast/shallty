const Browser = require('../Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { kusonime_url } = require('../config.json')

class Kusonime {
    /**
     * Parse and get anime list. Currently support only up to page 2.
     */
    async animeList() {
        const page = await Browser.newOptimizedPage()

        try {
            let animeList = []
            for (let i = 1; i < 3; i++) {
                await page.goto(`${kusonime_url}/anime-list-batch/${i > 1 ? `page/${i}/`: ''}`)
                const anchors = await Browser.$$waitAndGet(page, 'a.kmz')
                await Util.asyncForEach(anchors, async (anchor) => {
                    const title = await Browser.getPlainProperty(anchor, 'innerText')
                    const rawLink = await Browser.getPlainProperty(anchor, 'href')
                    const link = rawLink.replace(kusonime_url, '')

                    animeList.push({
                        title: title,
                        link: link,
                        raw_link: rawLink
                    })
                })
            }

            await page.close()

            return animeList
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse home page and get post list.
     * 
     * @param {Number} homePage Home page.
     */
    async newReleases(homePage = 1) {
        const page = await Browser.newOptimizedPage()

        try {
            const posts = []
            await page.goto(`${kusonime_url}/page/${homePage}`)
            const kovers = await Browser.$$waitAndGet(page, 'div.venz > ul > div.kover')
            await Util.asyncForEach(kovers, async (kover) => {
                const anchor = await kover.$('.episodeye > a')
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(kusonime_url, '')

                posts.push({
                    title: title,
                    link: link,
                    raw_link: rawLink
                })
            })

            await page.close()

            return posts
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
    
    /**
     * Parse download links from episode page of a title.
     * 
     * @param {String} link Episode page url.
     */
    async links(link) {
        const page = await Browser.newOptimizedPage()
        
        try {
            link = decodeURIComponent(link)
            await page.goto(kusonime_url + link, {
                timeout: 300000
            })
            
            const dlbod = await Browser.$waitAndGet(page, 'div.dlbod')
            const smokeddls = await dlbod.$$('div.smokeddl')
            const downloadLinks = smokeddls.length > 0 ? await this.parseSmokeddl(smokeddls) : await this.parseZeroSmodeddl(dlbod)
            
            await page.close()

            return downloadLinks
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse download links from episode page of a title.
     * 
     * @param smokeddls dlbod ElementHandle.
     */
    async parseSmokeddl(smokeddls) {
        let downloadLinks = []
        await Util.asyncForEach(smokeddls, async (smokeddl) => {
            let smokettl = await smokeddl.$('div.smokettl')
            if (typeof smokettl == 'undefined' || !smokettl) {
                smokettl = await smokeddl.$('.smokeurl:nth-child(1)')
            }
            const episodeTitle = await Browser.getPlainProperty(smokettl, 'innerText')
            const smokeurls = await smokeddl.$$('div.smokeurl')
            const newDownloadLinks = await this.parseSmokeurl(smokeurls, episodeTitle)
            downloadLinks = downloadLinks.concat(newDownloadLinks)
        })

        return downloadLinks
    }

    /**
     * Parse download links from episode page of a title that does not have smokeddl div.
     * 
     * @param dlbod dlbod ElementHandle.
     */
    async parseZeroSmodeddl(dlbod) {
        let smokettl = await dlbod.$('div.smokettl')
        if (typeof smokettl == 'undefined' || !smokettl) {
            smokettl = await dlbod.$('.smokeurl:nth-child(1)')
        }
        const episodeTitle = await Browser.getPlainProperty(smokettl, 'innerText')
        const smokeurls = await dlbod.$$('div.smokeurl')
        const downloadLinks = await this.parseSmokeurl(smokeurls, episodeTitle)

        return downloadLinks
    }

    /**
     * Parse download links from smokeurls div.
     * 
     * @param smokeurls ElementHandle.
     * @param {String} episodeTitle Episode title.
     */
    async parseSmokeurl(smokeurls, episodeTitle) {
        const downloadLinks = []
        const alpha = episodeTitle.replace(/download/i, '').replace(/subtitle /i, '').replace(/indonesia/i, '').trim()
        
        await Util.asyncForEach(smokeurls, async (smokeurl) => {
            const anchors = await smokeurl.$$('a')
            const strong = await smokeurl.$('strong')
            if (typeof strong == 'undefined' || !strong) {
                return false
            }

            const quality = await Browser.getPlainProperty(strong, 'innerText')

            await Util.asyncForEach(anchors, async (anchor) => {
                const host = await Browser.getPlainProperty(anchor, 'innerText')
                const link = await Browser.getPlainProperty(anchor, 'href')

                const episode = {
                    'episode': alpha,
                    'quality': quality,
                    'host': host,
                    'link': link
                }

                downloadLinks.push(episode)
            })
        })

        return downloadLinks
    }
}

module.exports = new Kusonime