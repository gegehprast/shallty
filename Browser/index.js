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
     * Create new page.
     */
    async newPage() {
        const page = await this.browser.newPage()
        page.setDefaultTimeout(30000)

        return page
    }

    /**
     * Create new optimized asset page.
     */
    async newOptimizedPage() {
        const page = await this.browser.newPage()
        page.setDefaultTimeout(30000)

        return await this.optimizePage(page)
    }

    /**
     * Create new page with different browser context
     * to support multiple sessions. The returned page will be optimized.
     * https://github.com/GoogleChrome/puppeteer/issues/85
     */
    async newPageWithNewContext() {
        const { browserContextId } = await this.browser._connection.send('Target.createBrowserContext')
        const page = await this.browser._createPageInContext(browserContextId)
        page.browserContextId = browserContextId
        page.setDefaultTimeout(30000)
        
        return await this.optimizePage(page)
    }

    /**
     * Get new tab page instance.
     * 
     * @param {Object} page Current page.
     * @param {Boolean} optimized Optimized or not.
     */
    async getNewTabPage(page, optimized = true) {
        const pageTarget = page.target()
        const newTarget = await this.browser.waitForTarget(target => target.opener() === pageTarget)
        const newPage = await newTarget.page()
        newPage.setDefaultTimeout(30000)

        return optimized ? await this.optimizePage(newPage) : newPage
    }

    /**
     * Optimize a page.
     * 
     * @param {Object} page Current page.
     */
    async optimizePage(page) {
        await page.setRequestInterception(true)

        page.on('request', (req) => {
            if (req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image') {
                req.abort()
            } else {
                req.continue()
            }
        })

        return page
    }

    /**
     * Close a page, use this function to close a page that has context.
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
     * @param {Object} page Browser page
     * @param {String} selector Selector
     */
    async $waitAndGet(page, selector) {
        await page.waitForSelector(selector)

        return await page.$(selector)
    }

    /**
     * Wait for a selector and then return all element
     * of that selector.
     * 
     * @param {Object} page Browser page
     * @param {String} selector Selector
     */
    async $$waitAndGet(page, selector) {
        await page.waitForSelector(selector)

        return await page.$$(selector)
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

    /**
     * Get a cookie object of page.
     * 
     * @param {Object} page Browser page
     * @param {String} name Name of the cookie to select
     */
    async getCookie(page, name) {
        const cookies = await page.cookies()

        const cookie = cookies.filter(cookie => cookie.name == name)

        return cookie[0]
    }
}

module.exports = new Browser