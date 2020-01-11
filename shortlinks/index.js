const Ahexa = require('./Ahexa')
const Anjay = require('./Anjay')
const Hexa = require('./Hexa')
const Hightech = require('./Hightech')
const Jelajahinternet = require('./Jelajahinternet')
const Kepoow = require('./Kepoow')
const Kontenajaib = require('./Kontenajaib')
const Semawur = require('./Semawur')
const Sukakesehattan = require('./Sukakesehattan')
const Teknoku = require('./Teknoku')
const Travellinginfos = require('./Travellinginfos')
const Xmaster = require('./Xmaster')

class Shortlink {
    constructor() {
        this.shorterners = [
            Ahexa,
            Anjay, 
            Hexa, 
            Hightech, 
            Jelajahinternet, 
            Kepoow, 
            Kontenajaib, 
            Semawur, 
            Sukakesehattan, 
            Teknoku, 
            Travellinginfos,
            Xmaster
        ]
    }

    async parse(link) {
        let shorterner

        for (const i of this.shorterners) {
            if (link.includes(i.marker)) {
                shorterner = i
                break
            }
        }

        return await shorterner.parse(link)
    }
}

module.exports = new Shortlink