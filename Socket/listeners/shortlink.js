const Shortlink =  require('../../shortlinks')

module.exports = {
    parse: async (io, socket, param) => {
        const data = await Shortlink.parse(param.link)

        io.emit('parse', data)
    },
}