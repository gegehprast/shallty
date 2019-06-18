const puppeteer = require('puppeteer')
const Browser = require('./Browser')
const Util = require('../utils/utils')

class Meownime {
    async getEpisodes(link) {
        const page = await Browser.browser.newPage()
        const episodes = new Map

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })

            const dlLinks = await page.$$('article > div > div > div.meow-dl-link', divs => divs)

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
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    async davinsurance(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
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

            return {link: splitted}
        } catch (e) {
            console.log(e)
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }

    async meowbox(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURI(link)
            await page.goto(link, {
                timeout: 300000
            })
            
            try {
                await page.waitForNavigation({
                    timeout: 30000,
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

            const finalUrl = page.url()
            await page.close()

            return {url: finalUrl}
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

module.exports = new Meownime