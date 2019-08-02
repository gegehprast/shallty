const puppeteer = require('puppeteer')
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { oploverz_url } = require('../config.json')

class Oploverz {
    /**
     * Check on going page and get latest released episodes.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(oploverz_url, {
                timeout: 300000
            })
            
            const list = await page.$$('#content > div.postbody > div.boxed > div.right > div.lts > ul > li')
            await Util.asyncForEach(list, async item => {
                const anchor = await item.$('div.dtl > h2 > a')
                const link = await anchor.getProperty('href').then(x => x.jsonValue())
                const title = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const matchEps = link.match(/(\d+)(?=-subtitle-indonesia)/)
                if (matchEps && matchEps != null) {
                    const numeral = matchEps[0].length == 1 ? '0' + matchEps[0] : matchEps[0]
                    const matchTitles = title.match(/(.+)(?= \d+)/, '')
                    if (matchTitles && matchTitles != null) {
                        const parsedTitle = matchTitles[0].replace(' Episode', '')
                        anime.push({
                            episode: numeral,
                            title: parsedTitle,
                            link: link
                        })
                    }
                }
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
     * Parse series page and get episode list.
     * @param link series page.
     */
    async series(link) {
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            const list = await page.$$('#content > div.postbody > div > div.episodelist > ul > li')
            await Util.asyncForEach(list, async (item, index) => {
                if (index >= 30) {
                    return false
                }
                
                const anchor = await item.$('span.leftoff > a')
                const episode = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

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
     * Parse download links from episode page.
     * @param link episode page.
     */
    async getDownloadLinks(link) {
        const page = await Browser.browser.newPage()
        const downloadLinks = []

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            const soraddls = await page.$$('#op-single-post > div.epsc > div[class="soraddl op-download"]')
            await Util.asyncForEach(soraddls, async soraddl => {
                const sorattls = await soraddl.$$('div[class="sorattl title-download"]')
                const soraurls = await soraddl.$$('div[class="soraurl list-download"]')
                await Util.asyncForEach(soraurls, async (soraurl, index) => {
                    let quality = await sorattls[index].getProperty('innerText').then(x => x.jsonValue())
                    quality = quality.replace('oploverz – ', '')
                    const anchors = await soraurl.$$('a')
                    await Util.asyncForEach(anchors, async anchor => {
                        const host = await anchor.getProperty('innerText').then(x => x.jsonValue())
                        const link = await anchor.getProperty('href').then(x => x.jsonValue())

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
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    async hexa(link) {
        const page = await Browser.browser.newPage()
        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })

            await Util.sleep(7000)
            const anchor = await page.$('center.link-content > a')
            const url = await anchor.getProperty('href').then(x => x.jsonValue())
            await page.close()
            
            return {url: url}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }
}

module.exports = new Oploverz