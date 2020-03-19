const Kiryuu = require('../../fantls/Kiryuu')

module.exports = {
    mangaList: (io, socket, data) => {
        io.emit('a', {
            msg: 'Hello A!',
        })
    },

    mangaInfo: (io, socket, data) => {
        io.emit('a', {
            msg: 'Hello A!',
        })
    },

    chapters: (io, socket, data) => {
        io.emit('a', {
            msg: 'Hello A!',
        })
    },

    images: (io, socket, data) => {
        io.emit('a', {
            msg: 'Hello A!',
        })
    },

    newReleases: (io, socket, data) => {
        io.emit('a', {
            msg: 'Hello A!',
        })
    },
}