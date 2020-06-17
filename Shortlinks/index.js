const fs = require('fs')
const path = require('path')
const Handler = require('../exceptions/Handler')
const ShortlinkModel = require('../Models/Shortlink')

const shortlinkFiles = fs.readdirSync(path.join(__dirname, './')).filter(file => file !== 'index.js' && file.endsWith('.js'))

const shortlinks = []

for (const file of shortlinkFiles) {
    shortlinks.push(require(`./${file}`))
}

class Shortlink {
    constructor() {
        this.shorterners = shortlinks
    }

    async parse(link) {
        if (process.env.WITH_DATABASE === 'true') {
            const fromDB = await ShortlinkModel.findOne({
                original: link
            })

            if (fromDB) {
                return {
                    success: true,
                    cached: true,
                    id: fromDB._id,
                    original: fromDB.original,
                    url: fromDB.parsed,
                    createdAt: fromDB.createdAt,
                    updatedAt: fromDB.updatedAt,
                }
            }
        }

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

        const parsed = await shorterner.parse(link)

        if (!parsed.error) {
            parsed.success = true

            if (process.env.WITH_DATABASE === 'true') {
                const newParsed = new ShortlinkModel({
                    original: link,
                    parsed: parsed.url
                })

                await newParsed.save()

                parsed.cached = false
            }
        }

        return parsed
    }
}

module.exports = new Shortlink