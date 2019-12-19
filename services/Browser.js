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

    /**
     * Wait for a selector and then return one element
     * of that selector.
     * 
     * @param {Object} element Element handle
     * @param {String} selector Selector
     */
    async waitAndGetSelector(element, selector) {
        await element.waitForSelector(selector)

        return await element.$(selector)
    }

    /**
     * Wait for a selector and then return all element
     * of that selector.
     * 
     * @param {Object} element Element handle
     * @param {String} selector Selector
     */
    async waitAndGetSelectors(element, selector) {
        await element.waitForSelector(selector)

        return await element.$$(selector)
    }

    /**
     * Get the plain value of a element property.
     * 
     * @param {Object} element Element handle
     * @param {String} property Property
     */
    async getPlainProperty(element, property) {
        return await element.getProperty(property).then(x => x.jsonValue())
    }
}

module.exports = new Browser