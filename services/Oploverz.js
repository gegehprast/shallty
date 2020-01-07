const Browser = require('../services/Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
const { oploverz_url } = require('../config.json')

class Oploverz {
    /**
     * Check on going page and get latest released episodes.
     */
    async newReleases() {
        const anime = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.1 (KHTML, like Gecko) Chrome/21.0.1180.83 Safari/537.1')
            await page.goto(oploverz_url, {
                timeout: 300000
            })
            
            await Util.sleep(15000)

            const list = await page.$$('#content > div.postbody > div.boxed > div.right > div.lts > ul > li')
            await Util.asyncForEach(list, async item => {
                const anchor = await item.$('div.dtl > h2 > a')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const title = await Browser.getPlainProperty(anchor, 'innerText')
                const matchEps = rawLink.match(/(\d+)(?=-subtitle-indonesia)/)
                if (matchEps && matchEps != null) {
                    const numeral = matchEps[0].length == 1 ? '0' + matchEps[0] : matchEps[0]
                    const matchTitles = title.match(/(.+)(?= \d+)/, '')
                    if (matchTitles && matchTitles != null) {
                        const parsedTitle = matchTitles[0].replace(' Episode', '')
                        anime.push({
                            episode: numeral,
                            title: parsedTitle,
                            raw_link: rawLink,
                            link: rawLink.replace(oploverz_url, '')
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
     * Parse and get anime list.
     */
    async animeList() {
        const animeList = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(oploverz_url + '/series/')

            const anchors = await Browser.$$waitAndGet(page, 'div.postbody > .movlist> ul > li > a')
            await Util.asyncForEach(anchors, async (anchor) => {
                const title = await Browser.getPlainProperty(anchor, 'innerHTML')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')

                animeList.push({
                    title: title,
                    link: rawLink.replace(oploverz_url, ''),
                    raw_link: rawLink
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
     * Parse series page and get episode list.
     * @param link series page.
     */
    async episodes(link) {
        const episodes = []
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(oploverz_url + link)
            await Util.sleep(15000)
            const list = await page.$$('#content > div.postbody > div > div.episodelist > ul > li')
            await Util.asyncForEach(list, async (item, index) => {
                if (index >= 30) {
                    return false
                }
                
                const anchor = await item.$('span.leftoff > a')
                const episode = await Browser.getPlainProperty(anchor, 'innerText')
                const rawLink = await Browser.getPlainProperty(anchor, 'href')
                const link = rawLink.replace(oploverz_url, '')

                episodes.push({
                    episode: episode,
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
     * Parse download links from episode page.
     * @param link episode page.
     */
    async links(link) {
        const page = await Browser.newOptimizedPage()
        const downloadLinks = []

        try {
            link = decodeURIComponent(link)
            await page.goto(oploverz_url + link)

            await Util.sleep(15000)
            
            const soraddls = await page.$$('#op-single-post > div.epsc > div[class="soraddl op-download"]')
            await Util.asyncForEach(soraddls, async soraddl => {
                const sorattls = await soraddl.$$('div[class="sorattl title-download"]')
                const soraurls = await soraddl.$$('div[class="soraurl list-download"]')
                await Util.asyncForEach(soraurls, async (soraurl, index) => {
                    let quality = await Browser.getPlainProperty(sorattls[index], 'innerText')
                    quality = quality.replace('oploverz – ', '')
                    const anchors = await soraurl.$$('a')
                    await Util.asyncForEach(anchors, async anchor => {
                        const host = await Browser.getPlainProperty(anchor, 'innerText')
                        const link = await Browser.getPlainProperty(anchor, 'href')

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

    async parseKontenajaib(link) {
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(link)

            await Util.sleep(9000)
            await page.click('#generater')
            await Util.sleep(9000)
            await page.click('#showlink')
            
            const newPage = await Browser.newTabPagePromise(page)
            await Util.sleep(9000)
            await newPage.click('#generater')
            await Util.sleep(9000)
            await newPage.click('#showlink')

            const finalPage = await Browser.newTabPagePromise(newPage)
            await Util.sleep(2000)
            const url = finalPage.url()
            
            await page.close()
            await newPage.close()
            await finalPage.close()

            return {url: url}
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async hexa(link) {
        link = decodeURIComponent(link)

        if (link.includes('travellinginfos.com')) {
            return this.parseTravelling(link)
        }

        if (link.includes('kontenajaib.xyz')) {
            const url = await this.parseKontenajaib(link)

            return url
        }

        const page = await Browser.newOptimizedPage()
        
        try {
            await page.goto(link)

            await Util.sleep(7000)
            const anchor = await page.$('center.link-content > a')
            const url = await Browser.getPlainProperty(anchor, 'href')
            await page.close()
            
            return {url: url}
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Oploverz