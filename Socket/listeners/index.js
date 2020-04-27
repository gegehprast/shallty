const Fansub = require('../../Fansubs')
const Fanscan = require('../../Fanscans')
const Shortlink = require('../../shortlinks')

module.exports = {
    fansubListener: (io, socket) => {
        socket.on('animeList', async function (params) {
            const data = await Fansub.animeList(params.fansub)

            io.emit('animeList', data)
        })

        socket.on('episodes', async function (params) {
            const data = await Fansub.episodes(params.fansub, params.link)

            io.emit('episodes', data)
        })

        socket.on('links', async function (params) {
            const data = await Fansub.links(params.fansub, params.link)

            io.emit('links', data)
        })

        socket.on('newReleases', async function (params) {
            const data = await Fansub.newReleases(params.fansub)

            io.emit('newReleases', data)
        })
    },

    fanscanListener: (io, socket) => {
        socket.on('mangaList', async function (params) {
            const data = await Fanscan.mangaList(params.fanscan)

            io.emit('mangaList', data)
        })

        socket.on('mangaInfo', async function (params) {
            const data = await Fanscan.mangaInfo(params.fanscan, params.link)

            io.emit('mangaInfo', data)
        })

        socket.on('chapters', async function (params) {
            const data = await Fanscan.chapters(params.fanscan, params.link)

            io.emit('chapters', data)
        })

        socket.on('images', async function (params) {
            const data = await Fanscan.images(params.fanscan)

            io.emit('images', data)
        })

        socket.on('newReleases', async function (params) {
            const data = await Fanscan.newReleases(params.fanscan)

            io.emit('newReleases', data)
        })
    },

    shortlinkListener: (io, socket) => {
        socket.on('parse', async function (params) {
            const data = await Shortlink.parse(params.link)

            io.emit('parse', data)
        })
    }
}