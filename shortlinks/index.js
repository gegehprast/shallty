const fs = require('fs')
const Handler = require('../exceptions/Handler')

const shortlinkFiles = fs.readdirSync('./Shortlinks').filter(file => file !== 'index.js' && file.endsWith('.js'))

const shortlinks = []

for (const file of shortlinkFiles) {
    shortlinks.push(require(`./${file}`))
}

class Shortlink {
    constructor() {
        this.shorterners = shortlinks
    }

    async parse(link) {
        let shorterner = null

        for (const i of this.shorterners) {
            if (Array.isArray(i.marker)) {
                for (const marker of i.marker) {
                    if (link.includes(marker)) {
                        shorterner = i
                        break
                    }
                }

                if (shorterner) {
                    break
                }
            } else {
                if (link.includes(i.marker)) {
                    shorterner = i
                    break
                }
            }
        }

        if (!shorterner) {
            return Handler.error('Error: Unknown shortlink.')
        }

        return await shorterner.parse(link)
    }
}

module.exports = new Shortlink