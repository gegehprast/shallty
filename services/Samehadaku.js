const puppeteer = require('puppeteer')
const Browser = require('./Browser')

class Samehadaku {
    async njirr(link) {
        let driveLink
        const page = await Browser.browser.newPage()

        try {
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

                await new Promise(resolve => setTimeout(resolve, 1500))
            } while (driveLink == 'javascript:')

            await page.close()

            return driveLink
        } catch (e) {
            if (e instanceof puppeteer.errors.TimeoutError) {
                await page.close()

                return false
            }

            return false
        }
    }
}

module.exports = new Samehadaku