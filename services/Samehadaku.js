const puppeteer = require('puppeteer')
const Browser = require('./Browser')
const Util = require('../utils/utils')
const { samehadaku_url } = require('../config.json')

class Samehadaku {
    /**
     * Get all title from on going page.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(samehadaku_url, {
                timeout: 300000
            })
            
            await page.waitForSelector('.mag-box-container')
            const magBoxContainer = await page.$$('.mag-box-container')
            const container = magBoxContainer[3]
            const posts = await container.$$('li[class="post-item  tie-standard"]')

            await Util.asyncForEach(posts, async (post, index) => {
                const titleHeader = await post.$('h3.post-title')
                const { title, link } = await titleHeader.$eval('a', node => ({
                    title: node.innerText,
                    link: node.href
                }))
                const parsedTitle = title.split(' Episode')[0]
                const matches = link.match(/(?<=episode-)(\d+)(?=-subtitle-indonesia)/)
                if (matches && matches != null) {
                    const numeral = matches[0].length == 1 ? '0' + matches[0] : matches[0]

                    anime[index] = {
                        episode: numeral,
                        title: parsedTitle,
                        link: link
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
            
            await page.waitForSelector('div.download-eps')
            const downloadDivs = await page.$$('div.download-eps')
            await Util.asyncForEach(downloadDivs, async downloadDiv => {
                let format
                const p = await page.evaluateHandle(node => node.previousElementSibling, downloadDiv)
                format = await p.getProperty('innerText')
                format = await format.jsonValue()
                format = format.replace('</b>', '')
                    .replace('</b>', '')
                    .replace(/(&amp;)/, '')

                if (format.match(/(3gp)/i)) {
                    return false
                } else if (format.match(/(MKV)/i)) {
                    format = 'MKV'
                } else if (format.match(/(265)/i)) {
                    format = 'x265'
                } else if (format.match(/(MP4)/i)) {
                    format = 'MP4'
                }

                const list = await downloadDiv.$$('li')
                await Util.asyncForEach(list, async item => {
                    const strong = await item.$('strong')
                    if (strong && strong != null) {
                        let quality = await strong.getProperty('innerText')
                        quality = await quality.jsonValue()

                        const anchors = await item.$$('a')
                        await Util.asyncForEach(anchors, async anchor => {
                            const host = await anchor.getProperty('innerText').then(async property => await property.jsonValue())
                            const link = await anchor.getProperty('href').then(async property => await property.jsonValue())

                            downloadLinks.push({
                                quality: quality,
                                host: host,
                                link: link
                            })
                        })
                    }
                })
            })

            await page.close()

            return downloadLinks
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
     * Parse tetew and get the final url.
     * @param link tetew url.
     */
    async tetew(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('div.download-link')
            const div = await page.$('div.download-link')
            const njiirLink = await div.$eval('a', node => node.href)
            const unjiired = await this.njiir(encodeURI(njiirLink))

            await page.close()

            return {url: unjiired.url}
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
     * Parse njiir and get the original download link.
     * @param link njiir url.
     */
    async njiir(link) {
        let driveLink
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('div.result > a')
            
            do {
                driveLink = await page.$eval('div.result > a', el => {
                    return el.href
                }).catch(e => {
                    console.log(e)
                })

                await Util.sleep(1500)
            } while (driveLink == 'javascript:')

            await page.close()

            return {url: driveLink}
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }
}

module.exports = new Samehadaku