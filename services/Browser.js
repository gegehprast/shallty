const puppeteer = require('puppeteer')
const { app_env } = require('../config.json')

class Browser {
    constructor() {
        this.browser = null
        this.browser2 = null
    }
    
    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: app_env == 'local' ? false : true,
                args: ['--no-sandbox']
            })
        }

        if (!this.browser2) {
            this.browser2 = await puppeteer.launch({
                headless: app_env == 'local' ? false : true,
                args: ['--no-sandbox']
            })
        }

        return [this.browser, this.browser2]
    }
}

module.exports = new Browser