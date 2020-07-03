const fs = require('fs')
const path = require('path')
const Handler = require('../exceptions/Handler')
const ShortlinkModel = require('../Models/Shortlink')
const Queue = require('../Queue')

const WITH_DATABASE = process.env.WITH_DATABASE === 'true'
const shortlinkFiles = fs.readdirSync(path.join(__dirname, './')).filter(file => file !== 'index.js' && file.endsWith('.js'))
const shortlinks = []

for (const file of shortlinkFiles) {
    shortlinks.push(require(`./${file}`))
}

class Shortlink {
    constructor() {
        this.shorterners = shortlinks
    }

    /**
     * Save new parsed shortlink to the database.
     * 
     * @param {String} originalLink 
     * @param {String} parsedLink 
     */
    async cacheShortlink(originalLink, parsedLink) {
        const newParsed = new ShortlinkModel({
            original: originalLink,
            parsed: parsedLink
        })

        await newParsed.save()
    }

    /**
     * Get parsed shortlink by the original link from the database.
     * 
     * @param {String} link 
     */
    async getCachedShortlink(link) {
        return await ShortlinkModel.findOne({
            original: link
        })
    }

    /**
     * Response with the cached shortlink.
     * 
     * @param cachedShortlink 
     */
    async responseWithCached(cachedShortlink) {
        return {
            success: true,
            cached: true,
            id: cachedShortlink._id,
            original: cachedShortlink.original,
            url: cachedShortlink.parsed,
            createdAt: cachedShortlink.createdAt,
            updatedAt: cachedShortlink.updatedAt,
        }
    }

    /**
     * Select the correct parser for the link.
     * 
     * @param {String} link 
     */
    selectParser(link) {
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

        return shorterner
    }

    async parse(link, options = {}) {
        if (WITH_DATABASE) {
            const cachedShortlink = await this.getCachedShortlink(link)

            if (cachedShortlink) return this.responseWithCached(cachedShortlink)
        }

        let parsed
        let shorterner = this.selectParser(link)
        
        if (!shorterner) return Handler.error('Error: Unknown shortlink.')

        if (options.queue) {
            const job = Queue.register(async () => {
                return await shorterner.parse(link)
            })

            parsed = await Queue.dispatch(job)
        } else {
            parsed = await shorterner.parse(link)
        }
        
        if (!parsed.error) {
            parsed.success = true
            parsed.cached = false

            if (WITH_DATABASE) await this.cacheShortlink(link, parsed.url)
        }

        return parsed
    }
}

module.exports = new Shortlink