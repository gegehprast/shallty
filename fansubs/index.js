const fs = require('fs')
const path = require('path')
const Handler = require('../exceptions/Handler')

const fansubFiles = fs.readdirSync(path.join(__dirname, './')).filter(file => file !== 'index.js' && file.endsWith('.js'))

const fansubs = {}

for (const file of fansubFiles) {
    Object.defineProperty(fansubs, file.toLowerCase().replace('.js', ''), {
        value: require(`./${file}`)
    })
}

class Fansub {
    constructor() {
        this.list = fansubs
    }

    async animeList(fansub, options = {}) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.animeList(options)
    }

    async episodes(fansub, link, options = {}) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.episodes(link, options)
    }

    async links(fansub, link, options = {}) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.links(link, options)
    }

    async newReleases(fansub, options = {}) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.newReleases(options)
    }
}

module.exports = new Fansub