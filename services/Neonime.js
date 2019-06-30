const puppeteer = require('puppeteer')
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { neonime_url } = require('../config.json')

class Neonime {
    /**
     * Get new tab page instance.
     * @param page current page.
     * @param browser current browser.
     */
    async newPagePromise(page, browser) {
        const pageTarget = page.target()
        const newTarget = await browser.waitForTarget(target => target.opener() === pageTarget)
        const newPage = await newTarget.page()

        return newPage
    }

    /**
     * Parse and get anime list.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(neonime_url + '/episode/', {
                timeout: 60000
            })

            await page.waitForSelector('table.list')
            const table = await page.$('table.list')
            const tRows = await table.$$('tbody > tr')
            await Util.asyncForEach(tRows, async trow => {
                const anchor = await trow.$('td.bb > a')
                const text = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const episodeSplit = text.split(' Episode ')
                const titleSplit = text.split(' Subtitle')
                const episode = episodeSplit[episodeSplit.length - 1]
                const title = titleSplit[0]
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

                anime.push({
                    episode: episode,
                    title: title,
                    link: link
                })
            })

            
            await page.close()

            return anime
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    /**
     * Parse and get anime list.
     */
    async animeList() {
        const page = await Browser.browser.newPage()

        try {
            await page.goto(neonime_url + '/list-anime/', {
                timeout: 60000
            })

            await page.waitForSelector('#az-slider')
            const slider = await page.$('#az-slider')
            const animeList = await slider.$$eval('a', nodes => nodes.map(x => {
                const title = x.innerText
                const link = x.href

                return {link: link, title: title}
            }))
            await page.close()

            return animeList
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    /**
     * Parse tv show page and get episodes.
     * @param link tv show page.
     */
    async tvShow(link) {
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 60000
            })

            await page.waitForSelector('div.episodiotitle')
            const episodios = await page.$$('div.episodiotitle')
            await Util.asyncForEach(episodios, async episodio => {
                const { episode, link } = await episodio.$eval('a', node => (
                    {
                        episode: node.innerText,
                        link: node.href
                    }
                ))

                episodes.push({
                    episode: episode,
                    link: link
                })
            })
            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    /**
     * Parse episode page and get download links.
     * @param link episode page.
     */
    async getEpisodes(link) {
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 60000
            })

            await page.waitForSelector('div.list-link-download')
            const list = await page.$$('div.list-link-download > ul > ul')
            await Util.asyncForEach(list, async item => {
                const quality = await item.$eval('label.label-download', node => node.innerText)
                const anchors = await item.$$('a')
                await Util.asyncForEach(anchors, async anchor => {
                    const host = await anchor.getProperty('innerText').then(x => x.jsonValue())
                    const link = await anchor.getProperty('href').then(x => x.jsonValue())

                    episodes.push({
                        quality: quality,
                        host: host,
                        link: link
                    })
                })
            })
            
            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    /**
     * Parse batch episode page and get download links.
     * @param link episode page.
     */
    async getBatchEpisodes(link) {
        const episodes = []
        let info1 = false
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 60000
            })

            
            await page.waitForSelector('.smokeurl').catch(e => {
                console.log(e)
                info1 = true
            })

            if (!info1) {
                const smokeurls = await page.$$('.smokeurl')
                await Util.asyncForEach(smokeurls, async smokeurl => {
                    const quality = await smokeurl.$eval('strong', node => node.innerText)
                    const anchors = await smokeurl.$$('a')
                    await Util.asyncForEach(anchors, async anchor => {
                        const host = await anchor.getProperty('innerText').then(x => x.jsonValue())
                        const link = await anchor.getProperty('href').then(x => x.jsonValue())

                        episodes.push({
                            quality: quality,
                            host: host,
                            link: link
                        })
                    })
                })
            } else {
                await page.waitForSelector('p[data-id="info1"]').catch(async e => {
                    console.log(e)
                    await page.close()
                    
                    return false
                })
                const smokeurls = await page.$$('p[data-id="info1"]')
                await Util.asyncForEach(smokeurls, async smokeurl => {
                    const strong = await smokeurl.$('strong')
                    if (strong && strong != null) {
                        const quality = await smokeurl.$eval('strong', node => node.innerText)
                        const anchors = await smokeurl.$$('a')
                        await Util.asyncForEach(anchors, async anchor => {
                            const host = await anchor.getProperty('innerText').then(x => x.jsonValue())
                            const link = await anchor.getProperty('href').then(x => x.jsonValue())

                            episodes.push({
                                quality: quality,
                                host: host,
                                link: link
                            })
                        })
                    }
                })
            }
            
            

            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    /**
     * Parse high tech.
     * @param link anime page.
     */
    async hightech(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 60000
            })

            await Util.sleep(6000)
            await page.waitForSelector('a[href="#generate"]')
            await page.click('a[href="#generate"]')
            await page.waitForSelector('a#link-download')
            await Util.sleep(3000)
            await page.click('a#link-download')
            
            const newPage = await this.newPagePromise(page, Browser.browser)
            const url = newPage.url()
            
            await page.close()
            await newPage.close()

            return {url: url}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }
}

module.exports = new Neonime