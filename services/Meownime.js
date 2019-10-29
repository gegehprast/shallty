const Browser = require('./Browser')
const Util = require('../utils/utils')
const { meownime_url } = require('../config.json')

class Meownime {
    /**
     * Parse episodes from completed anime.
     * @param link anime page.
     */
    async getEpisodes(link) {
        const page = await Browser.browser.newPage()
        const episodes = new Map

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })

            const dlLinks = await page.$$('article > div > div > div.meow-dl-link')

            await Util.asyncForEach(dlLinks, async (dlLink) => {
                const quality = await dlLink.$eval('.tombol', node => node.innerText)
                const episodeDivs = await dlLink.$$('div.isi-dl > table > tbody > tr:not([bgcolor="#eee"])')
                const dlLinkDivs = await dlLink.$$('div.isi-dl > table > tbody > tr[bgcolor="#eee"]')

                await Util.asyncForEach(episodeDivs, async (episodeDiv, index) => {
                    let alpha, size
                    const episode = await episodeDiv.$eval('td', node => node.innerText)
                    if (!episode.toLowerCase().includes('batch')) {
                        const episodeArr = episode.split(' — ')
                        alpha = episodeArr[0]
                        size = episodeArr[1]
                    } else {
                        const episodeArr = episode.split(' | ')
                        alpha = episodeArr[0]
                        size = episodeArr[1]
                    }

                    const fileHosts = await dlLinkDivs[index].$$eval('a', nodes => nodes.map(n => {
                        return {
                            host: n.innerText,
                            link: n.href
                        }
                    }))

                    if (!episodes.has(alpha)) {
                        episodes.set(alpha, [])
                    }
                    const epAlpha = episodes.get(alpha)
                    epAlpha.push({
                        quality: `${quality} - ${size}`,
                        fileHosts: fileHosts
                    })
                    episodes.set(alpha, epAlpha)
                })
            })
            
            await page.close()
            
            return Array.from(episodes)
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse davinsurance and get the final url such as zippy, meowfiles, meowbox, meowcloud, meowdrive, etc.
     * @param link davinsurance page.
     */
    async davinsurance(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })

            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#srl > form > input.sorasubmit'),
            ])
            
            const fullContent = await page.content()
            await page.close()

            // eslint-disable-next-line quotes
            let splitted = fullContent.split("function changeLink(){var a='")
            splitted = splitted[1].split(';window.open')
            splitted = splitted[0].replace(/(['"])+/g, '')

            return {url: splitted}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse meowbox and get the final url such as google drive.
     * Sometimes will return meowbox url if something wrong happens.
     * @param link meowbox page.
     */
    async meowbox(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            try {
                await page.waitForNavigation({
                    timeout: 10000,
                    waitUntil: 'domcontentloaded'
                })
            } catch (error) {
                console.log(error)
            }

            const currentUrl = page.url()
            if (currentUrl.includes('login.php')) {
                await page.waitForSelector('#inputEmail')
                await page.type('#inputEmail', 'shalltyanime', {
                    delay: 100
                })

                await page.waitForSelector('#inputPassword')
                await page.type('#inputPassword', '7bmAyN6XWHnzwRF', {
                    delay: 100
                })

                await page.waitForSelector('#Login > button')
                await Promise.all([
                    page.waitForNavigation({
                        timeout: 0,
                        waitUntil: 'networkidle2'
                    }),
                    page.click('#Login > button'),
                    page.waitForNavigation({
                        timeout: 0,
                        waitUntil: 'networkidle2'
                    }),
                ])
            }

            await page.waitForSelector('#page-top > header > div > form > button.download')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#page-top > header > div > form > button.download'),
            ])

            await Util.sleep(5000)

            const finalUrl = page.url()
            await page.close()

            return {url: finalUrl}
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse meowdrive or meowcloud and get the final url such as google drive.
     * Sometimes will return meowbox url if something wrong happens.
     * @param link meowdrive or meowcloud page.
     */
    async meowdrive(link) {
        let finalUrl
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            await page.waitForSelector('#ddl > ul > li:nth-child(2) > a')
            await Promise.all([
                page.waitForNavigation({
                    timeout: 0,
                    waitUntil: 'networkidle2'
                }),
                page.click('#ddl > ul > li:nth-child(2) > a')
            ])

            const currentUrl = page.url()
            if (currentUrl.includes('meowbox')) {
                const meowboxLink = encodeURI(currentUrl)
                const { url } = await this.meowbox(meowboxLink)
                finalUrl = url
            } else {
                finalUrl = currentUrl
            }

            await page.close()

            return {url: finalUrl}
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
            await page.goto(meownime_url + '/tag/ongoing/', {
                timeout: 300000
            })
            
            await page.waitForSelector('article')
            const articles = await page.$$('article')
            await Util.asyncForEach(articles, async (article, index) => {
                const episode = await article.$eval('div > div.postedon', node => node.innerText)
                const info = await article.$eval('div > div.out-thumb > h1 > a', node => {
                    return {title: node.innerText, link: node.href}
                })
                // remove meownime url and trailing slash
                let link = info.link.replace(meownime_url, '').replace(/\/+$/, '')
                anime[index] = {
                    episode: episode.split(' ')[1],
                    title: info.title,
                    link: link
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
     * Parse episodes from on going anime.
     * @param link anime page.
     */
    async onGoingAnime(link) {
        const episodes = []
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            await page.waitForSelector('tr[bgcolor="#eee"]')
            const tRowsHandle = await page.$$('tr[bgcolor="#eee"]')
            await Util.asyncForEach(tRowsHandle, async tRowHandle => {
                // search for previous sibling table element
                let tableHandle = await page.evaluateHandle(tRow => {
                    return tRow.parentElement.previousElementSibling
                }, tRowHandle)
                // search again if table element is null
                if (tableHandle.asElement() == null) {
                    tableHandle = await page.evaluateHandle(tRow => {
                        return tRow.parentElement.parentElement.previousElementSibling
                    }, tRowHandle)
                }
                
                try {
                    let episode = await tableHandle.$eval('center', node => node.innerText)
                    const matches = episode.match(/Episode ([0-9])+/g)
                    if (matches && matches != null) {
                        const episodeAlpha = matches[0]
                        const episodeNumeral = episodeAlpha.split(' ')[1].length == 1 ? 
                            '0' + episodeAlpha.split(' ')[1] : 
                            episodeAlpha.split(' ')[1]
                        const qualityHandle = await page.evaluateHandle(tRow => tRow.previousElementSibling, tRowHandle)
                        const quality = await (await qualityHandle.getProperty('innerText')).jsonValue()

                        const anchorsHandle = await tRowHandle.$$('a')
                        await Util.asyncForEach(anchorsHandle, async anchorHandle => {
                            const host = await (await anchorHandle.getProperty('innerText')).jsonValue()
                            const link = await (await anchorHandle.getProperty('href')).jsonValue()
                            
                            episodes.push({
                                episodeAlpha: episodeAlpha,
                                episodeNumeral: episodeNumeral,
                                quality: quality,
                                host: host,
                                link: link
                            })
                        })
                    }
                } catch (error) {
                    console.log(error)
                }
            })

            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }

    /**
     * Parse episodes from movie anime.
     * @param link anime page.
     */
    async getMovieEpisodes(link) {
        const page = await Browser.browser.newPage()
        const episodes = []

        try {
            link = decodeURIComponent(link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('table[class=" table table-hover"]:not(style)')
            const tables = await page.$$('table[class=" table table-hover"]:not(style)')
            await Util.asyncForEach(tables, async table => {
                const tRows = await table.$$('tr')
                if (tRows.length > 1) {
                    const quality = await table.$eval('tr', node => node.innerText)
                    const downloadLinks = await tRows[1].$$eval('a', nodes => nodes.map(n => {
                        return {
                            host: n.innerText,
                            link: n.href
                        }
                    }))
                    episodes.push({
                        quality: quality,
                        downloadLinks: downloadLinks
                    })
                }
            })

            await page.close()

            return episodes
        } catch (e) {
            console.log(e)
            await page.close()

            return false
        }
    }
}

module.exports = new Meownime