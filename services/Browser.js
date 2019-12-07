const puppeteer = require('puppeteer')
const { app_env } = require('../config.json')

class Browser {
    constructor() {
        this.browser = null
    }
    
    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: app_env == 'local' ? false : true,
                args: ['--no-sandbox']
            })
        }

        console.log('\x1b[32m', '[Crawler Ready] You can start crawling via "/api" endpoint.')

        return [this.browser, this.browser2]
    }

    /**
     * Create new page with different browser context
     * to support multiple sessions
     * https://github.com/GoogleChrome/puppeteer/issues/85
     */
    async newPageWithNewContext() {
        const { browserContextId } = await this.browser._connection.send('Target.createBrowserContext')
        const page = await this.browser._createPageInContext(browserContextId)
        page.browserContextId = browserContextId

        return page
    }

    /**
     * Close a page, use this function to close a page that has context
     * 
     * @param {Object} page Puppeteer page
     */
    async closePage(page) {
        if (page.browserContextId != undefined) {
            await this.browser._connection.send('Target.disposeBrowserContext', {
                browserContextId: page.browserContextId
            })
        }
        await page.close()
    }

    async waitAndGetSelector(page, selector) {
        await page.waitForSelector(selector)

        return await page.$(selector)
    }

    async getPlainProperty(selector, property) {
        return await selector.getProperty(property).then(x => x.jsonValue())
    }

    async clickWithNewNavigation(page) {

    }
}

module.exports = new Browser