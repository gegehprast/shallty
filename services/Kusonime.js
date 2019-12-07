const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { kusonime_url } = require('../config.json')

class Kusonime {
    constructor(browser) {
        this.browser = browser
    }
    
    /**
     * Parse and get anime list. Currently support only up to page 2.
     */
    async animeList() {
        const page = await this.browser.browser.newPage()

        try {
            let animeList = []
            for (let i = 1; i < 2; i++) {
                await page.goto(`${kusonime_url}/anime-list-batch/${page > 1 ? `page/${page}/`: ''}`, {
                    timeout: 300000
                })

                await page.waitForSelector('a.kmz')
                const list = await page.$$eval('a.kmz', nodes => nodes.map(x => ({
                    link: x.href,
                    title: x.innerText
                })))

                animeList = animeList.concat(list)
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
    async homePage(homePage = 1) {
        const page = await this.browser.browser.newPage()
        const posts = []

        try {
            await page.goto(`${kusonime_url}/page/${homePage}`, {
                timeout: 300000
            })

            await page.waitForSelector('div.venz')
            const kovers = await page.$$('div.venz > ul > div.kover')
            
            await Util.asyncForEach(kovers, async (kover) => {
                const anchor = await kover.$('.episodeye > a')
                const title = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

                posts.push({
                    link: link,
                    title: title
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
     * Parse download links from smokeurls div.
     * 
     * @param smokeurls ElementHandle.
     * @param {String} episodeTitle Episode title.
     */
    async parseSmokeurl(smokeurls, episodeTitle) {
        const downloadLinks = []
        await Util.asyncForEach(smokeurls, async (smokeurl) => {
            const anchors = await smokeurl.$$('a')
            const strong = await smokeurl.$('strong')
            if (typeof strong == 'undefined' || !strong) {
                return false
            }

            const quality = await strong.getProperty('innerText').then(x => x.jsonValue())

            await Util.asyncForEach(anchors, async (anchor) => {
                const host = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

                const episode = {
                    'episode': episodeTitle,
                    'quality': quality,
                    'host': host,
                    'link': link
                }

                downloadLinks.push(episode)
            })
        })

        return downloadLinks
    }

    /**
     * Parse download links from episode page of a title that does not have smokeddl div.
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
            const episodeTitle = await smokettl.getProperty('innerText').then(x => x.jsonValue())
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
        const episodeTitle = await smokettl.getProperty('innerText').then(x => x.jsonValue())
        const smokeurls = await dlbod.$$('div.smokeurl')
        const downloadLinks = await this.parseSmokeurl(smokeurls, episodeTitle)

        return downloadLinks
    }

    /**
     * Parse download links from episode page of a title.
     * 
     * @param {String} link Episode page url.
     */
    async getDownloadLinks(link) {
        const page = await this.browser.browser.newPage()
        
        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            const dlbod = await this.browser.waitAndGetSelector(page, 'div.dlbod')
            const smokeddls = await dlbod.$$('div.smokeddl')
            const info = await page.$('div.info > p:nth-child(6)')
            const status = await this.browser.getPlainProperty(info, 'innerText')
            const downloadLinks = smokeddls.length > 0 ? await this.parseSmokeddl(smokeddls) : await this.parseZeroSmodeddl(dlbod)
            
            await page.close()

            return {
                status: (status && status == 'Status: Completed') ? 'completed' : 'airing',
                links: downloadLinks
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse kepoow and get original download link.
     * 
     * @param {String} link kepoow url. 
     */
    parseKepoow(params) {
        return {
            url: Util.base64Decode(params.r)
        }
    }

    /**
     * Parse sukakesehattan and get original download link.
     * 
     * @param {String} link sukakesehattan url.
     */
    parseSukakesehattan(params) {
        return {
            url: params.url
        }
    }

    /**
     * Parse jelajahinternet and get original download link.
     * 
     * @param {String} link jelajahinternet url. 
     */
    parseJelajahinternet(params) {
        return {
            url: params.url
        }
    }

    async waitGetLinkElementToShowUp(downloadButton) {
        let classProp = await downloadButton.getProperty('className').then(x => x.jsonValue())
        do {
            await Util.sleep(5000)
            classProp = await downloadButton.getProperty('className').then(x => x.jsonValue())
            console.log(classProp)
        } while (classProp !== 'get-link')

        return true
    }

    async parseSemawur(link) {
        const page = await this.browser.newPageWithNewContext()

        try {
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('#link-view > button')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#link-view > button')
            ])
            await page.waitForSelector('a.get-link')
            await Util.sleep(5000)
            const downloadButton = await page.$('a.get-link')
            await this.waitGetLinkElementToShowUp(downloadButton)
            const downloadLinks = await downloadButton.getProperty('href').then(x => x.jsonValue())

            await this.browser.closePage(page)

            return {
                url: downloadLinks
            }
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Proceed semawur to get original download link.
     * 
     * @param {String} link URL decoded semawur url.
     */
    async semrawut(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)

        if (link.includes('kepoow.me')) {
            return this.parseKepoow(link)
        }

        if (link.includes('sukakesehattan.')) {
            return this.parseSukakesehattan(params)
        }

        if (link.includes('jelajahinternet.')) {
            return this.parseJelajahinternet(params)
        }

        if (Object.entries(params).length > 0 && params.url) {
            return {
                url: decodeURIComponent(params.url).replace(/\++/g, ' ')
            }
        }
        
        return await this.parseSemawur(link)
    }
}

module.exports = Kusonime