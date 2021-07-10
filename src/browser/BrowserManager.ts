import puppeteer from 'puppeteer'
import Util from '../utils/index'

type Browser = {
    id: string
    instance: puppeteer.Browser
}

class BrowserManager {
    browsers: Browser[] = []

    constructor() {
        this.init()
    }

    async init() {
        if (this.browsers.length === 0) {
            await this.newBrowser(
                this.getDefaultBrowserArgs()
            )
        }
    }

    getDefaultBrowserArgs() {
        return ['--disable-gpu', '--no-sandbox', '--disable-setuid-sandbox']
    }

    /**
     * Select the first browser instance. Create if currently there's no browser.
     * 
     */
    async selectOrCreateBrowser() {
        if (this.browsers.length === 0) {
            return await this.newBrowser(
                this.getDefaultBrowserArgs()
            )
        }

        return this.browsers[0]
    }

    /**
     * Create new puppeteer browser instance and store it to browsers.
     * 
     * @param args BrowserLaunchArgumentOptions.args
     * @returns 
     */
    async newBrowser(args: string[] = ['--no-sandbox']) {
        const browsers = this.browsers
        const browser = await puppeteer.launch({
            headless: process.env.HEADLESS === 'true',
            args: args
        })
        const newBrowser = {
            id: Util.randomString(10),
            instance: browser
        }

        browsers.push(newBrowser)
        this.browsers = browsers

        console.info('\x1b[34m%s\x1b[0m', '[Browser Manager] A new puppeteer browser has been initialized.')

        return newBrowser
    }

    /**
     * Destroy puppeteer browser instance by id.
     * 
     * @param id browser id
     * @returns 
     */
    async destroyBrowser(id: string) {
        const found = this.browsers.find(x => x.id === id)

        if (!found) {
            return
        }

        const filtered = this.browsers.filter(x => x.id !== id)
        this.browsers = filtered

        await found.instance.close()
    }
    
    /**
     * Create new page on a browser instance. Default to the first browser in browsers.
     * 
     * @param target Browser target.
     * @returns 
     */
    async newPage(target: Browser = null): Promise<puppeteer.Page> {
        const browser = target ? target : await this.selectOrCreateBrowser()

        // create the page
        const page = await browser.instance.newPage()
        
        // set default timeout for the page
        page.setDefaultTimeout(30000)

        return page
    }

    /**
     * Create new optimized asset page on a browser instance. Default to the first browser in browsers.
     * 
     * @param target Browser target.
     * @returns
     */
    async newOptimizedPage(target: Browser = null): Promise<puppeteer.Page> {
        const browser = target ? target : await this.selectOrCreateBrowser()

        // create the page
        const page = await browser.instance.newPage()

        // set default timeout for the page
        page.setDefaultTimeout(30000)

        return await this.optimizePage(page)
    }

    /**
     * Create new page with different browser context to support multiple sessions. The returned page will be optimized.
     * https://github.com/GoogleChrome/puppeteer/issues/85
     * 
     * @param target Browser target.
     * @returns
     */
    async newPageWithNewContext(target: Browser = null): Promise<puppeteer.Page> {
        const browser = target ? target : await this.selectOrCreateBrowser()

        // create incognito context
        const browserContext = await browser.instance.createIncognitoBrowserContext()

        // create the page
        const page = await browserContext.newPage()
        
        // set default timeout for the page
        page.setDefaultTimeout(30000)

        return await this.optimizePage(page)
    }

    /**
     * Get a page (b) that has been created as a new tab from a source page (a).
     * 
     * @param page The source page (a) that the new tab has been created from.
     * @param optimize Wheter or not to optimize the new page.
     * @param target Browser target.
     */
    async getPageFromNewTab(page: puppeteer.Page, optimize = true, target: Browser = null): Promise<puppeteer.Page|null> {
        const browser = target ? target : await this.selectOrCreateBrowser()

        // get the page target of the source page 
        const pageTarget = page.target()

        // get the first target that has been opened by the source page target
        const newPageTarget = await browser.instance.waitForTarget(target => target.opener() === pageTarget)

        if (!newPageTarget) {
            return null
        }

        // get the page
        const newPage = await newPageTarget.page()

        // set default timeout for the page
        newPage.setDefaultTimeout(30000)

        return optimize ? await this.optimizePage(newPage) : newPage
    }

    /**
     * Optimize a page.
     * 
     * @param {Object} page Puppeteer page.
     */
    async optimizePage(page: puppeteer.Page) {
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
     * Close a page that has been opened with context.
     * 
     * @param page Puppeteer page.
     */
    async closePageWithContext(page: puppeteer.Page) {
        await page.browserContext().close()
    }

    /**
     * Wait for a selector and then return one element
     * of that selector.
     * 
     * @param page Puppeteer page.
     * @param selector Selector.
     */
    async $waitAndGet(page: puppeteer.Page, selector: string) {
        await page.waitForSelector(selector)

        return await page.$(selector)
    }

    /**
     * Wait for a selector and then return all element
     * of that selector.
     *
     * @param page Puppeteer page.
     * @param selector Selector.
     */
    async $$waitAndGet(page: puppeteer.Page, selector: string) {
        await page.waitForSelector(selector)

        return await page.$$(selector)
    }

    /**
     * Get the plain value of a element property.
     * 
     * @param element Element handle.
     * @param property Property.
     */
    async getPlainProperty<T>(element: puppeteer.ElementHandle<Element>, property: string) : Promise<T> {
        return await element.getProperty(property).then(x => x.jsonValue())
    }

    /**
     * Get a cookie object of page.
     * 
     * @param page Puppeteer page.
     * @param name Name of the cookie.
     */
    async getCookie(page: puppeteer.Page, name: string) {
        const cookies = await page.cookies()

        const cookie = cookies.filter(cookie => cookie.name == name)

        return cookie[0]
    }
}

export default new BrowserManager
