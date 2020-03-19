const fansubs = {
    kusonime: require('../../fansubs/Kusonime'), 
    moenime: require('../../fansubs/Moenime'), 
    neonime: require('../../fansubs/Neonime'), 
    oploverz: require('../../fansubs/Oploverz'), 
    samehadaku: require('../../fansubs/Samehadaku'), 
}

module.exports = {
    animeList: async (io, socket, param) => {
        const data = await fansubs[param.fansub].animeList()

        io.emit('animeList', data)
    },

    episodes: async (io, socket, param) => {
        const data = await fansubs[param.fansub].episodes(param.link)

        io.emit('episodes', data)
    },

    links: async (io, socket, param) => {
        const data = await fansubs[param.fansub].links(param.link)

        io.emit('links', data)
    },

    newReleases: async (io, socket, param) => {
        const data = await fansubs[param.fansub].newReleases()

        io.emit('newReleases', data)
    },
}