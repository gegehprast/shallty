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
}

module.exports = new Browser