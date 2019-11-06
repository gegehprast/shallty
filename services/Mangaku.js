const Browser = require('./Browser')
const Util = require('../utils/utils')
const { mangaku_url } = require('../config.json')

class Mangaku {
    /**
     * Get manga list from manga list page.
     *
     */
    async getMangaList() {
        const page = await Browser.browser.newPage()

        try {
            await page.goto(mangaku_url + '/daftar-komik-bahasa-indonesia', {
                timeout: 300000
            })

            await page.waitForSelector('#wrapper_body > div')
            const mangaList = []
            const uls = await page.$$('ul.series_alpha')
            await Util.asyncForEach(uls, async (ul) => {
                const lis = await ul.$$('li')
                await Util.asyncForEach(lis, async (li) => {
                    const { title, link } = await li.$eval('a', anchor => {
                        return {
                            title: anchor.innerText,
                            link: anchor.href
                        }
                    })

                    mangaList.push({
                        title: title,
                        link: link
                    })
                })
            })

            await page.close()

            return mangaList
        } catch (error) {
            console.error(error)
            await page.close()

            return false
        }
    }

    /**
     * Get manga info from manga page.
     * 
     * @param {String} link Manga page url.
     */
    async getMangaInfo(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(mangaku_url + link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('#abc')
            const title = await page.$eval('h1.titles', h1 => {
                return h1.innerText
            })

            let p = await page.$('div#abc > p')
            if (!p || p.length < 1) {
                p = await page.$('table > tbody > tr > td:nth-child(1) > p:nth-child(4)')
            }

            const info = await p.getProperty('innerText').then(x => x.jsonValue())
            const arrInfo = info.split('\n')
            const parsedInfo = {}

            await Util.asyncForEach(arrInfo, (x) => {
                const item = x.toLowerCase()

                if (item.length > 0) {
                    if (item.includes('author')) {
                        const author = x.replace(/author: |author : |author :|author:|author\(s\):: /gi, '')
                        parsedInfo.author = author
                    } else if (item.includes('artist')) {
                        const artist = x.replace(/artist: |artist : |artist :|artist:|artist\(s\):: /gi, '')
                        parsedInfo.artist = artist
                    } else if (item.includes('sinopsis')) {
                        const sinopsis = x.replace(/sinopsis: |sinopsis : |sinopsis :|sinopsis:|sinopsis:: /gi, '')
                        parsedInfo.synopsis = sinopsis
                    } else if (item.includes('summary')) {
                        const summary = x.replace(/summary: |summary : |summary :|summary:|summary:: /gi, '')
                        parsedInfo.summary = summary
                    } else if (item.includes('type')) {
                        const type = x.replace(/type: |type : |type :|type:|type:: /gi, '')
                        parsedInfo.type = type
                    } else if (item.includes('genre')) {
                        const genre = x.replace(/genre: |genre : |genre :|genre:|genre:: /gi, '')
                        parsedInfo.genre = genre.split(', ')
                    } else if (item.includes('alternative name')) {
                        const alternative_name = x.replace(/alternative name: |alternative name : |alternative name :|alternative name:|alternative name:: /gi, '')
                        parsedInfo.alternative_title = alternative_name
                    }
                }
            })

            await page.close()

            return {
                title: title,
                raw_info: info,
                parsed_info: parsedInfo
            }
        } catch (error) {
            console.error(error)
            await page.close()

            return false
        }
    }

    /**
     * Get chapter list from manga page.
     * 
     * @param {String} link Manga page url.
     */
    async getChapters(link) {
        const page = await Browser.browser.newPage()

        try {
            link = decodeURIComponent(mangaku_url + link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('#abc')

            let anchors = await page.$$('div.entry > div > table > tbody > tr > td:nth-child(1) > small > div:nth-child(2) > p > a')
            if (!anchors || anchors.length < 1) {
                anchors = await page.$$('div.entry > table > tbody > tr > td:nth-child(1) > div:nth-child(12) > small > a')
            }
            if (!anchors || anchors.length < 1) {
                const div = await page.$('#contentwrap > div.post > div > table > tbody > tr > td:nth-child(1) > small > div:nth-child(3)')
                anchors = await div.$$('a')
            }
            if (!anchors || anchors.length < 1) {
                const lis = await page.$$('div.entry > div > table > tbody > tr > td:nth-child(1) > small > div:nth-child(2) > ul > li')
                anchors = []
                await Util.asyncForEach(lis, async (li) => {
                    const anchor = await li.$('a')
                    anchors.push(anchor)
                })
            }

            const chapters = []
            await Util.asyncForEach(anchors, async (anchor) => {
                const chapter = await anchor.getProperty('innerText').then(x => x.jsonValue())
                const link = await anchor.getProperty('href').then(x => x.jsonValue())

                if (chapter && chapter !== '') {
                    chapters.push({
                        chapter: chapter,
                        link: link
                    })
                }
            })

            await page.close()

            return chapters
        } catch (error) {
            console.error(error)
            await page.close()

            return false
        }
    }

    /**
     * Check if image is not an ad.
     * 
     * @param {String} src Image url.
     */
    imageIsNotAnAd(src) {
        const lower = src.toLowerCase()
        const credit = lower.includes('creadit') || lower.includes('credit')
        const front = lower.includes('halaman') || lower.includes('depan')
        const comment = lower.includes('komen')
        const ad = lower.includes('shakeout') || lower.includes('global') || lower.includes('getready') || lower.includes('728x90') || lower.includes('.gif')

        return !credit && !front && !comment && !ad
    }

    /**
     * Get images from chapter page.
     * 
     * @param {String} link Chapter page url.
     */
    async images(link) {
        const page = await Browser.browser.newPage()

        try {
            if ((link).toLowerCase().includes('mirror')) {
                return {
                    message: 'Shallty can\'t parse this page'
                }
            }
            
            link = decodeURIComponent(mangaku_url + link)
            await page.goto(link, {
                timeout: 300000
            })

            await page.waitForSelector('div.entry')
            
            const images = []
            const chapter = await page.$eval('h1.titles', h1 => {
                return h1.innerText
            })
            const separators = await page.$$('div.separator')
            await Util.asyncForEach(separators, async (separator) => {
                const src = await separator.$eval('img', img => {
                    return img.src
                })

                if (this.imageIsNotAnAd(src)) {
                    images.push({
                        link: src
                    })
                }
            })

            await page.close()

            return {
                chapter: chapter,
                images: images
            }
        } catch (error) {
            console.error(error)
            await page.close()

            return false
        }
    }

    /**
     * Get new releases from home page.
     *
     */
    async newReleases() {
        const page = await Browser.browser.newPage()

        try {
            await page.goto(mangaku_url, {
                timeout: 300000
            })

            await page.waitForSelector('div.kiri_anime > div.utao')
            const utaos = await page.$$('div.kiri_anime > div.utao')
            const releases = []
            await Util.asyncForEach(utaos, async (utao) => {
                const { title, titleLink } = await utao.$eval('a.series', a => {
                    return {
                        title: a.innerText,
                        titleLink: a.href
                    }
                })

                const { chapter, chapterLink } = await utao.$eval('ul.Manga_Chapter > li > a', (ul) => {
                    return {
                        chapter: ul.innerText,
                        chapterLink: ul.href
                    }
                })

                releases.push({
                    title: title,
                    title_url: titleLink,
                    chapter: chapter,
                    chapter_url: chapterLink
                })
            })

            await page.close()

            return releases
        } catch (error) {
            console.error(error)
            await page.close()

            return false
        }
    }
}

module.exports = new Mangaku