const Util = require('../utils/utils')

class Travellinginfos {
    constructor() {
        this.marker = 'travellinginfos'
    }

    async parse(link) {
        link = decodeURIComponent(link)

        const params = Util.getAllUrlParams(link)

        return Util.base64Decode(params.r)
    }
}

module.exports = new Travellinginfos