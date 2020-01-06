const Browser = require('../services/Browser')
const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')
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
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

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
                Handler.error(error)
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
                await page.goto(link.replace(/\/+$/, '') + `/page/${i}`)
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
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Get all title from on going page.
     */
    async checkOnGoingPage() {
        const anime = []
        const page = await Browser.newOptimizedPage()

        try {
            await page.goto(samehadaku_url)
            
            await page.waitForSelector('.mag-box-container')
            const magBoxContainer = await page.$$('.mag-box-container')
            const container = magBoxContainer[samehadaku_magBoxContainer]
            const posts = await container.$$('li[class="post-item  tie-standard"]')

            await Util.asyncForEach(posts, async (post) => {
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
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse download links from episode page of a title.
     * @param link episode page.
     */
    async links(link) {
        const page = await Browser.newOptimizedPage()
        const downloadLinks = []

        try {
            link = decodeURIComponent(link)
            await page.goto(samehadaku_url + link)
            
            await page.waitForSelector('div.download-eps')
            const downloadDivs = await page.$$('div.download-eps')
            await Util.asyncForEach(downloadDivs, async downloadDiv => {
                const p = await page.evaluateHandle(node => node.previousElementSibling, downloadDiv)
                let format = await Browser.getPlainProperty(p, 'innerText')
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
                        const quality = await Browser.getPlainProperty(strong, 'innerText')
                        const anchors = await item.$$('a')
                        await Util.asyncForEach(anchors, async anchor => {
                            const host = await Browser.getPlainProperty(anchor, 'innerText')
                            const link = await Browser.getPlainProperty(anchor, 'href')

                            downloadLinks.push({
                                quality: `${format} ${quality}`,
                                host: host,
                                link: link
                            })
                        })
                    }
                })
            })

            await page.close()

            return downloadLinks
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async parseTetewBase64UrlParam(untetewed) {
        const queries = Util.getAllUrlParams(untetewed)
        if (queries.r) {
            return {
                url: Util.base64Decode(queries.r)
            }
        }
        return {
            url: untetewed
        }
    }

    /**
     * Parse tetew and get the final url.
     * @param link tetew url.
     */
    async tetew(link, skip = false) {
        let final
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

            await page.waitForSelector('div.download-link')
            const div = await page.$('div.download-link')
            const untetewed = await div.$eval('a', node => node.href)

            if (skip) {
                await page.close()
                return this.parseTetewBase64UrlParam(untetewed)
            }

            // njiir
            const unjiired = await this.njiir(encodeURI(untetewed))
            if (unjiired != false) {
                await page.close()

                return {
                    url: unjiired.url
                }
            }

            // eue
            const uneue = await this.eueSiherp(encodeURI(untetewed))
            if (uneue != false) {
                await page.close()

                return {
                    url: uneue.url
                }
            }

            await page.goto(untetewed)
            try {
                await page.waitForSelector('div.download-link')
                const div2 = await page.$('div.download-link')
                const untetewed2 = await div2.$eval('a', node => node.href)
                await page.goto(untetewed2)
                final = page.url()
                await page.close()
            } catch (e) {
                console.log(e)
                await page.close()
                return this.parseTetewBase64UrlParam(untetewed)
            }

            return {url: final}
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    /**
     * Parse njiir and get the original download link.
     * @param link njiir url.
     */
    async njiir(link) {
        const page = await Browser.newOptimizedPage()

        try {
            let downloadLink, anchor
            link = decodeURIComponent(link)
            await page.goto(link)

            await page.waitForSelector('div.result > a')
            await Util.sleep(8000)
            anchor = await page.$('div.result > a')
            downloadLink = await Browser.getPlainProperty(anchor, 'href')
            if (downloadLink == 'javascript:' || downloadLink.includes('javascript') == true) {
                await anchor.click()
            }
            await Util.sleep(5000)
            anchor = await page.$('div.result > a')
            downloadLink = await Browser.getPlainProperty(anchor, 'href')
            await page.close()

            return {url: downloadLink}
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

    async eueSiherp(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link)

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
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }

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

    //anjay.info
    async anjay(link) {
        const page = await Browser.newOptimizedPage()

        try {
            link = decodeURIComponent(link)
            if (link.includes('ahexa.')) {
                return this.tetew(link, true)
            }

            await page.goto(link)

            await Util.sleep(13000)
            await page.waitForSelector('div.to > a')
            await page.click('div.to > a')
            await page.waitForSelector('#showlink')
            await page.click('#showlink')
            
            const newPage = await this.newPagePromise(page, Browser.browser)
            const url = newPage.url()

            await page.close()
            await newPage.close()

            const final = this.tetew(url, true)

            return final
        } catch (error) {
            await page.close()

            return Handler.error(error)
        }
    }
}

module.exports = new Samehadaku