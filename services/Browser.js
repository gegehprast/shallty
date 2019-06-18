const puppeteer = require('puppeteer')

class Browser {
    constructor() {
        this.browser = null
    }
    
    async init() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: false,
                args: ['--no-sandbox']
            })
        }

        return this.browser
    }
}

module.exports = new Browser