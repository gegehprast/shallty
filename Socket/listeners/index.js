const fansub = require('./fansub')
const fantl = require('./fantl')
const shortlink = require('./shortlink')

module.exports = {
    fansubListener: (io, socket) => {
        socket.on('animeList', function (param) {
            fansub.animeList(io, socket, param)
        })

        socket.on('episodes', function (param) {
            fansub.episodes(io, socket, param)
        })

        socket.on('links', function (param) {
            fansub.links(io, socket, param)
        })

        socket.on('newReleases', function (param) {
            fansub.newReleases(io, socket, param)
        })
    },

    fantlListener: (io, socket) => {
        socket.on('mangaList', function (param) {
            fantl.mangaList(io, socket, param)
        })

        socket.on('mangaInfo', function (param) {
            fantl.mangaInfo(io, socket, param)
        })

        socket.on('chapters', function (param) {
            fantl.chapters(io, socket, param)
        })

        socket.on('images', function (param) {
            fantl.images(io, socket, param)
        })

        socket.on('newReleases', function (param) {
            fantl.newReleases(io, socket, param)
        })
    },

    shortlinkListener: (io, socket) => {
        socket.on('parse', function (param) {
            shortlink.parse(io, socket, param)
        })
    }
}