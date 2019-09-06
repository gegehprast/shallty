// eslint-disable-next-line no-unused-vars
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { kusonime_url } = require('../config.json')

class Kusonime {
    /**
     * Parse and get anime list.
     */
    async animeList() {
        const page = await Browser.browser.newPage()

        try {
            await page.goto(kusonime_url + '/anime-list-batch/', {
                timeout: 300000
            })

            await page.waitForSelector('a.kmz')
            const animeList = await page.$$eval('a.kmz', nodes => nodes.map(x => {
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
            const animeList2 = await page.$$eval('a.kmz', nodes => nodes.map(x => {
                const title = x.innerText
                const link = x.href

                return {
                    link: link,
                    title: title
                }
            }))

            const animeList3 = animeList.concat(animeList2)

            await page.close()

            return animeList3
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse download links from episode page of a title.
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
            
            await page.waitForSelector('div.dlbod')
            const dlbod = await page.$('div.dlbod')
            const smokeddls = await dlbod.$$('div.smokeddl')
            const info = await page.$('div.info > p:nth-child(6)')
            const status = await info.getProperty('innerText').then(x => x.jsonValue())
            const statusAnime = (status && status == 'Status: Completed') ? 'completed' : 'airing'
            
            await Util.asyncForEach(smokeddls, async (smokeddl) => {
                const smokettl = await smokeddl.$('div.smokettl')
                const episodeTitle = await smokettl.getProperty('innerText').then(x => x.jsonValue())
                const smokeurls = await smokeddl.$$('div.smokeurl')

                await Util.asyncForEach(smokeurls, async (smokeurl) => {
                    const anchors = await smokeurl.$$('a')
                    const strong = await smokeurl.$('strong')
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
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    async semrawut(link) {
        const page = await Util.newPageWithNewContext(Browser.browser)

        try {
            link = decodeURI(link)
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

            await Util.closePage(Browser.browser, page)

            return {
                url: downloadLinks
            }
        } catch (error) {
            console.log(error)
            await page.close()

            return false
        }
    }
}

module.exports = new Kusonime