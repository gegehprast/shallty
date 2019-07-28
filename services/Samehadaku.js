// eslint-disable-next-line no-unused-vars
const puppeteer = require('puppeteer')
const Browser = require('./Browser')
const Util = require('../utils/utils')
const {
    samehadaku_url,
    samehadaku_magBoxContainer
} = require('../config.json')

class Samehadaku {
    /**
     * Parse and get episode information from a post element handler.
     * @param post post element handler.
     */
    async parsePostElement(post) {
        const { title, postLink } = await post.$eval('a', node => ({
            title: node.innerText, 
            postLink: node.href
        }))
        if (!postLink.match(/(opening)/) && !postLink.match(/(ending)/)) {
            // const matches = postLink.match(/(?<=episode-)(\d+)(?=-subtitle-indonesia)/)
            const matches = postLink.match(/(?<=episode-)(\d+)/)
            if (matches && matches != null) {
                const numeral = matches[0].length == 1 ? '0' + matches[0] : matches[0]

                return {
                    episode: numeral,
                    title: title,
                    link: postLink
                }
            }
        }

        return null
    }

    /**
     * Parse and get episodes from a category/label page.
     * @param link category/label page.
     */
    async getEpisodes(link) {
        let totalPage
        const pageLimit = 3
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 30000
            })

            try {
                await page.waitForSelector('#content > div > div > div.pages-nav')
                const pageNav = await page.$('#content > div > div > div.pages-nav')
                let lastPage = await pageNav.$('li.last-page')
                if (!lastPage) {
                    lastPage = await pageNav.$$('li:not([class="the-next-page"])')
                    lastPage = lastPage[lastPage.length - 1]
                }
                const lastPageLink = await lastPage.$eval('a', node => node.href)
                totalPage = lastPageLink.replace(/\/+$/, '').split('/')
                totalPage = parseInt(totalPage[totalPage.length - 1])
                totalPage = totalPage > pageLimit ? pageLimit : totalPage
            } catch (error) {
                console.log(error)
                totalPage = 1
            }
            
            
            const postContainer = await page.$('ul#posts-container')
            const posts = await postContainer.$$('h3.post-title')
            await Util.asyncForEach(posts, async post => {
                const parsedEpisode = await this.parsePostElement(post)
                if (parsedEpisode)
                    episodes.push(parsedEpisode)
            })

            for (let i = 2; i <= totalPage; i++) {
                await page.goto(link.replace(/\/+$/, '') + `/page/${i}`, {
                    timeout: 30000
                })
                await page.waitForSelector('ul#posts-container')
                const postContainer = await page.$('ul#posts-container')
                const posts = await postContainer.$$('h3.post-title')
                await Util.asyncForEach(posts, async post => {
                    const parsedEpisode = await this.parsePostElement(post)
                    if (parsedEpisode)
                        episodes.push(parsedEpisode)
                })
            }

            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Get all title from on going page.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.browser.newPage()

        try {
            await page.goto(samehadaku_url, {
                timeout: 30000
            })
            
            await page.waitForSelector('.mag-box-container')
            const magBoxContainer = await page.$$('.mag-box-container')
            const container = magBoxContainer[samehadaku_magBoxContainer]
            const posts = await container.$$('li[class="post-item  tie-standard"]')

            await Util.asyncForEach(posts, async (post, index) => {
                const titleHeader = await post.$('h3.post-title')
                const { title, link } = await titleHeader.$eval('a', node => ({
                    title: node.innerText,
                    link: node.href
                }))
                const parsedTitle = title.split(' Episode')[0]
                // const matches = link.match(/(?<=episode-)(\d+)(?=-subtitle-indonesia)/)
                const matches = link.match(/(?<=episode-)(\d+)/)
                if (matches && matches != null) {
                    const numeral = matches[0].length == 1 ? '0' + matches[0] : matches[0]

                    anime.push({
                        episode: numeral,
                        title: parsedTitle,
                        link: link
                    })
                }
            })

            await page.close()

            return anime
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
                timeout: 30000
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
            await page.close()

            return false
        }
    }

    /**
     * Parse tetew and get the final url.
     * @param link tetew url.
     */
    async tetew(link) {
        let final
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 30000
            })

            await page.waitForSelector('div.download-link')
            const div = await page.$('div.download-link')
            const untetewed = await div.$eval('a', node => node.href)

            const uneue = await this.eueSiherp(encodeURI(untetewed))
            if (uneue != false) {
                await page.close()

                return {url: uneue.url}
            }

            const unjiired = await this.njiir(encodeURI(untetewed))
            if (unjiired != false) {
                await page.close()

                return {url: unjiired.url}
            }

            await page.goto(untetewed, {
                timeout: 30000
            })
            try {
                await page.waitForSelector('div.download-link')
                const div2 = await page.$('div.download-link')
                const untetewed2 = await div2.$eval('a', node => node.href)
                await page.goto(untetewed2, {
                    timeout: 30000
                })
                final = page.url()
                await page.close()
            } catch (e) {
                console.log(e)
                await page.close()
                const queries = Util.getAllUrlParams(untetewed)
                if (queries.r) {
                    return {url: Util.base64Decode(queries.r)}
                }
                return {url: untetewed}
            }

            return {url: final}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse njiir and get the original download link.
     * @param link njiir url.
     */
    async njiir(link) {
        let downloadLink
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 30000
            })

            await page.waitForSelector('div.result > a')
            
            do {
                downloadLink = await page.$eval('div.result > a', el => {
                    return el.href
                }).catch(e => {
                    console.log(e)
                })

                await Util.sleep(1500)
            } while (downloadLink == 'javascript:' || downloadLink.includes('javascript') == true)

            await page.close()

            return {url: downloadLink}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    async eueSiherp(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 30000
            })

            await page.waitForSelector('button#download2')
            await page.click('button#download2')
            await Util.sleep(7000)
            await page.waitForSelector('button#download')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('button#download')
            ])
            const final = page.url()
            await page.close()

            return {url: final}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }
}

module.exports = new Samehadaku