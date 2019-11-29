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
            await page.goto(kusonime_url + '/anime-list-batch/', {
                timeout: 300000
            })
            
            await page.waitForSelector('a.kmz')
            const page1 = await page.$$eval('a.kmz', nodes => nodes.map(x => {
                const title = x.innerText
                const link = x.href

                return {
                    link: link,
                    title: title
                }
            }))
            
            await page.goto(kusonime_url + '/anime-list-batch/page/2/', {
                timeout: 300000,
                waitUntil: 'networkidle2'
            })
            await page.waitForSelector('a.kmz')
            const page2 = await page.$$eval('a.kmz', nodes => nodes.map(x => {
                const title = x.innerText
                const link = x.href

                return {
                    link: link,
                    title: title
                }
            }))
            
            const animeList = page1.concat(page2)

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
     * Parse download links from episode page of a title that does not have smokeddl div.
     * 
     * @param {Object} dlbod dlbod ElementHandle.
     * @param {String} statusAnime Status anime from kusonime.
     */
    async zeroSmodeddl(dlbod, statusAnime) {
        const downloadLinks = []
        let smokettl = await dlbod.$('div.smokettl')
        if (typeof smokettl == 'undefined' || !smokettl) {
            smokettl = await dlbod.$('.smokeurl:nth-child(1)')
        }
        const episodeTitle = await smokettl.getProperty('innerText').then(x => x.jsonValue())
        const smokeurls = await dlbod.$$('div.smokeurl')

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

        return {
            status: statusAnime,
            links: downloadLinks
        }
    }

    /**
     * Parse download links from episode page of a title.
     * 
     * @param {String} link Episode page url.
     */
    async getDownloadLinks(link) {
        const page = await this.browser.browser.newPage()
        const downloadLinks = []
        
        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            
            await page.waitForSelector('div.dlbod')
            const dlbod = await page.$('div.dlbod')
            const smokeddls = await dlbod.$$('div.smokeddl')
            const info = await page.$('div.info > p:nth-child(6)')
            const status = await info.getProperty('innerText').then(x => x.jsonValue())
            const statusAnime = (status && status == 'Status: Completed') ? 'completed' : 'airing'
            
            // return zeroSmodeddl if there is no smokeddls
            if (smokeddls.length < 1) {
                return this.zeroSmodeddl(dlbod, statusAnime)
            }

            await Util.asyncForEach(smokeddls, async (smokeddl) => {
                let smokettl = await smokeddl.$('div.smokettl')
                if (typeof smokettl == 'undefined' || !smokettl) {
                    smokettl = await smokeddl.$('.smokeurl:nth-child(1)')
                }
                const episodeTitle = await smokettl.getProperty('innerText').then(x => x.jsonValue())
                const smokeurls = await smokeddl.$$('div.smokeurl')

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
            })
            
            await page.close()

            return {
                status: statusAnime,
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
    async kepoow(link) {
        const params = Util.getAllUrlParams(link)

        return {url: Util.base64Decode(params.r)}
    }

    /**
     * Parse sukakesehattan and get original download link.
     * 
     * @param {String} link sukakesehattan url.
     */
    async sukakesehattan(link) {
        const params = Util.getAllUrlParams(decodeURIComponent(link))
        let url = params.url

        return {
            url: url
        }
    }

    /**
     * Parse jelajahinternet and get original download link.
     * 
     * @param {String} link jelajahinternet url. 
     */
    async jelajahinternet(link) {
        const params = Util.getAllUrlParams(decodeURIComponent(link))
        let url = params.url

        return {
            url: url
        }
    }

    /**
     * Proceed semawur to get original download link.
     * 
     * @param {String} link URL decoded semawur url.
     */
    async semrawut(link) {
        link = decodeURIComponent(link)

        if (link.includes('kepoow.me')) {
            return this.kepoow(link)
        }

        if (link.includes('sukakesehattan.')) {
            return this.sukakesehattan(link)
        }

        if (link.includes('jelajahinternet.')) {
            return this.jelajahinternet(link)
        }

        const params = Util.getAllUrlParams(link)

        if (Object.entries(params).length > 0 && params.url) {
            const url = decodeURIComponent(params.url).replace(/\++/g, ' ')
            
            return {
                url: url
            }
        }
        
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

            let classProp = await downloadButton.getProperty('className').then(x => x.jsonValue())
            do {
                await Util.sleep(5000)
                classProp = await downloadButton.getProperty('className').then(x => x.jsonValue())
                console.log(classProp)
            } while (classProp !== 'get-link')

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
}

module.exports = Kusonime