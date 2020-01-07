const Anjay = require('./Anjay')
const Hexa = require('./Hexa')
const Hightech = require('./Hightech')
const Kontenajaib = require('./Kontenajaib')
const Semawur = require('./Semawur')
const Teknoku = require('./Teknoku')
const Tetew = require('./Tetew')

class Shortlink {
    constructor() {
        this.shorterner = {
            anjay: Anjay,
            hexa: Hexa,
            hightech: Hightech,
            kontenajaib: Kontenajaib,
            semawur: Semawur,
            teknoku: Teknoku,
            tetew: Tetew
        }
    }

    async parse(shorterner, link) {
        return await this.shorterner[shorterner].parse(link)
    }
}

module.exports = new Shortlink