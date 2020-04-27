const Util = require('../utils/utils')
const Handler = require('../exceptions/Handler')

class Xmaster {
    constructor() {
        this.marker = 'xmaster.xyz'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)
        let url = null

        if (params.sitex) {
            url = Util.base64Decode(params.sitex)
        }

        if (params.xyzkl) {
            url = Util.base64Decode(params.xyzkl)
        }

        if (!url) {
            return Handler.error('Error Xmaster: no paramater.')
        }

        return {url: url}
    }
}

module.exports = new Xmaster