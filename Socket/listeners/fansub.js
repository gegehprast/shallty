const fansubs = {
    Kusonime: require('../../fansubs/Kusonime'), 
    Moenime: require('../../fansubs/Moenime'), 
    Neonime: require('../../fansubs/Neonime'), 
    Oploverz: require('../../fansubs/Oploverz'), 
    Samehadaku: require('../../fansubs/Samehadaku'), 
}

module.exports = {
    animeList: async (io, socket, param) => {
        const data = await fansubs[param.fansub].animeList()

        io.emit('animeList', data)
    },

    episodes: async (io, socket, param) => {
        const data = await fansubs[param.fansub].episodes()

        io.emit('episodes', data)
    },

    links: async (io, socket, param) => {
        const data = await fansubs[param.fansub].links()

        io.emit('links', data)
    },

    newReleases: async (io, socket, param) => {
        const data = await fansubs[param.fansub].newReleases()

        io.emit('newReleases', data)
    },
}