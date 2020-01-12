const Util = require('../utils/utils')

class Kepoow {
    constructor() {
        this.marker = 'kepoow'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)

        return {
            url: decodeURIComponent(Util.base64Decode(params.r))
        }
    }
}

module.exports = new Kepoow