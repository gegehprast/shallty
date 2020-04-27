const fs = require('fs')
const path = require('path')
const Handler = require('../exceptions/Handler')

const fanscanFiles = fs.readdirSync(path.join(__dirname, './')).filter(file => file !== 'index.js' && file.endsWith('.js'))

const fanscans = {}

for (const file of fanscanFiles) {
    Object.defineProperty(fanscans, file.toLowerCase().replace('.js', ''), {
        value: require(`./${file}`)
    })
}

class Fanscan {
    constructor() {
        this.list = fanscans
    }

    async mangaList(fanscan, options = {}) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.mangaList(options)
    }

    async mangaInfo(fanscan, link, options = {}) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.mangaInfo(link, options)
    }

    async chapters(fanscan, link, options = {}) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.chapters(link, options)
    }

    async images(fanscan, link, options = {}) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.images(link, options)
    }

    async newReleases(fanscan, options = {}) {
        const selected = this.list[fanscan]

        if (!selected) {
            return Handler.error('Error: Unknown fanscan.')
        }

        return await selected.newReleases(options)
    }
}

module.exports = new Fanscan