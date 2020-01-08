/* eslint-disable no-undef */
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('samehadaku', function () {
    describe('anime list', function () {
        it('should return an array of anime list which has title, link, raw link, and is batch', async function () {
            this.timeout(60000)
            await Browser.init()
            const Samehadaku = require('../../fansubs/SamehadakuEas')
            const list = await Samehadaku.animeList()

            expect(list).to.be.an('array')
            expect(list).to.not.be.empty
            list.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('title')
                expect(item).to.has.property('link')
                expect(item).to.has.property('raw_link')
            })
        })
    })

    describe('episodes', function () {
        it('should return an array of episodes which has episode, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Samehadaku = require('../../fansubs/SamehadakuEas')
            const episodes = await Samehadaku.episodes('%2Fanime%2Fgegege-no-kitarou-2018%2F')

            expect(episodes).to.be.an('array')
            episodes.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('episode')
                expect(item).to.has.property('link')
                expect(item).to.has.property('raw_link')
            })
        })
    })

    describe('links', function () {
        it('should return an array of download links which has quality, host, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Samehadaku = require('../../fansubs/Samehadaku')
            const links = await Samehadaku.links('%2Fgegege-no-kitarou-episode-87%2F')

            expect(links).to.be.an('array')
            links.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('quality')
                expect(item).to.has.property('host')
                expect(item).to.has.property('link')
            })
        })
    })

    describe('new releases', function () {
        it('should return an array of episodes which has episode, title, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Samehadaku = require('../../fansubs/SamehadakuEas')
            const list = await Samehadaku.newReleases()

            expect(list).to.be.an('array')
            list.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('episode')
                expect(item).to.has.property('title')
                expect(item).to.has.property('link')
                expect(item).to.has.property('raw_link')
            })
        })
    })
})