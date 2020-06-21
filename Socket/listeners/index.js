const Fansub = require('../../Fansubs')
const Fanscan = require('../../Fanscans')
const Shortlink = require('../../Shortlinks')

module.exports = {
    fansubListener: (io, socket) => {
        socket.on('animeList', async function (params) {
            const data = await Fansub.animeList(params.fansub, params)

            io.emit('animeList', data)
        })

        socket.on('episodes', async function (params) {
            const data = await Fansub.episodes(params.fansub, params.link, params)

            io.emit('episodes', data)
        })

        socket.on('links', async function (params) {
            const data = await Fansub.links(params.fansub, params.link, params)

            io.emit('links', data)
        })

        socket.on('newReleases', async function (params) {
            const data = await Fansub.newReleases(params.fansub, params)

            io.emit('newReleases', data)
        })
    },

    fanscanListener: (io, socket) => {
        socket.on('mangaList', async function (params) {
            const data = await Fanscan.mangaList(params.fanscan, params)

            io.emit('mangaList', data)
        })

        socket.on('mangaInfo', async function (params) {
            const data = await Fanscan.mangaInfo(params.fanscan, params.link, params)

            io.emit('mangaInfo', data)
        })

        socket.on('chapters', async function (params) {
            const data = await Fanscan.chapters(params.fanscan, params.link, params)

            io.emit('chapters', data)
        })

        socket.on('images', async function (params) {
            const data = await Fanscan.images(params.fanscan, params)

            io.emit('images', data)
        })

        socket.on('newReleases', async function (params) {
            const data = await Fanscan.newReleases(params.fanscan, params)

            io.emit('newReleases', data)
        })
    },

    shortlinkListener: (io, socket) => {
        socket.on('parse', async function (params) {
            const data = await Shortlink.parse(params.link, { queue: true })
            io.to(socket.id).emit('parse', data)
        })
    }
}