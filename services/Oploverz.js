const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { oploverz_url } = require('../config.json')

class Oploverz {
    constructor(browser) {
        this.browser = browser
    }

    /**
     * Check on going page and get latest released episodes.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await this.browser.browser.newPage()

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1')
            await page.goto(oploverz_url, {
                timeout: 300000
            })
            
            await Util.sleep(15000)

            const list = await page.$$('#content > div.postbody > div.boxed > div.right > div.lts > ul > li')
            await Util.asyncForEach(list, async item => {
                const anchor = await item.$('div.dtl > h2 > a')
                const link = await this.browser.getPlainProperty(anchor, 'href')
                const title = await this.browser.getPlainProperty(anchor, 'innerText')
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
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse series page and get episode list.
     * @param link series page.
     */
    async series(link) {
        const episodes = []
        const page = await this.browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            await Util.sleep(15000)

            const list = await page.$$('#content > div.postbody > div > div.episodelist > ul > li')
            await Util.asyncForEach(list, async (item, index) => {
                if (index >= 30) {
                    return false
                }
                
                const anchor = await item.$('span.leftoff > a')
                const episode = await this.browser.getPlainProperty(anchor, 'innerText')
                const link = await this.browser.getPlainProperty(anchor, 'href')

                episodes.push({
                    episode: episode,
                    link: link
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
     * Parse download links from episode page.
     * @param link episode page.
     */
    async getDownloadLinks(link) {
        const page = await this.browser.browser.newPage()
        const downloadLinks = []

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })

            await Util.sleep(15000)
            
            const soraddls = await page.$$('#op-single-post > div.epsc > div[class="soraddl op-download"]')
            await Util.asyncForEach(soraddls, async soraddl => {
                const sorattls = await soraddl.$$('div[class="sorattl title-download"]')
                const soraurls = await soraddl.$$('div[class="soraurl list-download"]')
                await Util.asyncForEach(soraurls, async (soraurl, index) => {
                    let quality = await this.browser.getPlainProperty(sorattls[index], 'innerText')
                    quality = quality.replace('oploverz – ', '')
                    const anchors = await soraurl.$$('a')
                    await Util.asyncForEach(anchors, async anchor => {
                        const host = await this.browser.getPlainProperty(anchor, 'innerText')
                        const link = await this.browser.getPlainProperty(anchor, 'href')

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
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    parseTravelling(link) {
        const params = Util.getAllUrlParams(link)

        return Util.base64Decode(params.r)
    }

    async hexa(link) {
        const page = await this.browser.browser.newPage()
        try {
            link = decodeURIComponent(link)

            if (link.includes('travellinginfos.com')) {
                link = this.parseTravelling(link)
            }

            if (link.includes('kontenajaib.xyz')) {
                link = this.parseTravelling(link)
            }

            await page.goto(link, {
                timeout: 300000
            })

            await Util.sleep(7000)
            const anchor = await page.$('center.link-content > a')
            const url = await this.browser.getPlainProperty(anchor, 'href')
            await page.close()
            
            return {url: url}
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = Oploverz