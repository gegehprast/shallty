/* eslint-disable no-undef */
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('teknoku', function () {
    describe('parse', function () {
        it('should return an object which has url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const Teknoku = require('../../shotlinks/Teknoku')
            const data = await Teknoku.parse('https%3A%2F%2Fteknoku.me%2F%3Fid%3DcWFkTnBBZlEvZ1NvUHdYUGNkQ1ZPeGNnb0pjK2s1VDJWY2dlakh2Ykwrbjk0VkRUVGR2bWZwSHNpbVFVZUdhSjNTYUhySnBsS05jN2NmUHMzTk1BMWc9PQ%3D%3D')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
        })
    })
})