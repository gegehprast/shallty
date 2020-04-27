const fs = require('fs')
const Handler = require('../exceptions/Handler')

const fansubFiles = fs.readdirSync('./Fansubs').filter(file => file !== 'index.js' && file.endsWith('.js'))

const fansubs = {}

for (const file of fansubFiles) {
    Object.defineProperty(fansubs, file.replace('.js', ''), {
        value: require(`./${file}`)
    })
}

class Fansub {
    constructor() {
        this.list = fansubs
    }

    async animeList(fansub) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.animeList()
    }

    async episodes(fansub, link) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.episodes(link)
    }

    async links(fansub, link) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.links(link)
    }

    async newReleases(fansub) {
        const selected = this.list[fansub]

        if (!selected) {
            return Handler.error('Error: Unknown fansub.')
        }

        return await selected.newReleases()
    }
}

module.exports = new Fansub