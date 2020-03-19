const fantls = {
    kiryuu: require('../../fantls/Kiryuu'),
}

module.exports = {
    mangaList: async (io, socket, param) => {
        const data = await fantls[param.fantl].mangaList()

        io.emit('mangaList', data)
    },

    mangaInfo: async (io, socket, param) => {
        const data = await fantls[param.fantl].mangaInfo(param.link)

        io.emit('mangaInfo', data)
    },

    chapters: async (io, socket, param) => {
        const data = await fantls[param.fantl].chapters(param.link)

        io.emit('chapters', data)
    },

    images: async (io, socket, param) => {
        const data = await fantls[param.fantl].images(param.link)

        io.emit('images', data)
    },

    newReleases: async (io, socket, param) => {
        const data = await fantls[param.fantl].newReleases()

        io.emit('newReleases', data)
    },
}