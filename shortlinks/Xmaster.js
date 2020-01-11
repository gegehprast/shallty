const Util = require('../utils/utils')

class Xmaster {
    constructor() {
        this.marker = 'xmaster.xyz'
    }

    async parse(link) {
        link = decodeURIComponent(link)
        const params = Util.getAllUrlParams(link)
        if (params.sitex) {
            return {
                url: Util.base64Decode(params.sitex)
            }
        }

        if (params.xyzkl) {
            return {
                url: Util.base64Decode(params.xyzkl)
            }
        }
    }
}

module.exports = new Xmaster