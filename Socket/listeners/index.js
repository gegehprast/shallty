const fansub = require('./fansub')
const fantl = require('./fantl')

module.exports = {
    fansubListener: (io, socket) => {
        socket.on('animeList', function (data) {
            fansub.animeList(io, socket, data)
        })

        socket.on('episodes', function (data) {
            fansub.episodes(io, socket, data)
        })

        socket.on('links', function (data) {
            fansub.links(io, socket, data)
        })

        socket.on('newReleases', function (data) {
            fansub.newReleases(io, socket, data)
        })
    },

    fantlListener: (io, socket) => {
        socket.on('mangaList', function (data) {
            fantl.mangaList(io, socket, data)
        })

        socket.on('mangaInfo', function (data) {
            fantl.mangaInfo(io, socket, data)
        })

        socket.on('chapters', function (data) {
            fantl.chapters(io, socket, data)
        })

        socket.on('images', function (data) {
            fantl.images(io, socket, data)
        })

        socket.on('newReleases', function (data) {
            fantl.newReleases(io, socket, data)
        })
    }
}