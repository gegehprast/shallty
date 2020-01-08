const Util = require('../utils/utils')

class Jelajahinternet {
    constructor() {
        this.marker = 'jelajahinternet'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)

        return {
            url: decodeURIComponent(params.url)
        }
    }
}

module.exports = new Jelajahinternet