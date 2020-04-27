const fs = require('fs')
const Handler = require('../exceptions/Handler')

const fanscanFiles = fs.readdirSync('./Fanscans').filter(file => file !== 'index.js' && file.endsWith('.js'))

const fanscans = {}

for (const file of fanscanFiles) {
    Object.defineProperty(fanscans, file.replace('.js', ''), {
        value: require(`./${file}`)
    })
}

class Fanscan {
    constructor() {
        this.list = fanscans
    }

    async mangaList(fanscan) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.mangaList()
    }

    async mangaInfo(fanscan, link) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.mangaInfo(link)
    }

    async chapters(fanscan, link) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.chapters(link)
    }

    async images(fanscan, link) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.images(link)
    }

    async newReleases(fanscan) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.newReleases()
    }
}

module.exports = new Fanscan