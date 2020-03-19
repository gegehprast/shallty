const fantls = {
    kiryuu: require('../../fantls/Kiryuu'),
}

module.exports = {
    mangaList: async (io, socket, param) => {
        const data = await fantls[param.fansub].mangaList()

        io.emit('mangaList', data)
    },

    mangaInfo: async (io, socket, param) => {
        const data = await fantls[param.fansub].mangaInfo(param.link)

        io.emit('mangaInfo', data)
    },

    chapters: async (io, socket, param) => {
        const data = await fantls[param.fansub].chapters(param.link)

        io.emit('chapters', data)
    },

    images: async (io, socket, param) => {
        const data = await fantls[param.fansub].images(param.link)

        io.emit('images', data)
    },

    newReleases: async (io, socket, param) => {
        const data = await fantls[param.fansub].newReleases()

        io.emit('newReleases', data)
    },
}