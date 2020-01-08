const Util = require('../utils/utils')

class Sukakesehattan {
    constructor() {
        this.marker = 'sukakesehattan'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)

        return {
            url: decodeURIComponent(params.url)
        }
    }
}

module.exports = new Sukakesehattan