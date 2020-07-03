/* eslint-disable no-undef */
require('dotenv').config()
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('kusonime', function () {
    describe('anime list', function () {
        it('should return an array of anime list which has title, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../Fansubs/Kusonime')
            const list = await Kusonime.animeList()

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

    describe('links', function () {
        it('should return an array of download links which has quality, host, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../Fansubs/Kusonime')
            const links = await Kusonime.links('%2Ftiger-mask-w-batch-subtitle-indonesia%2F')

            expect(links).to.be.an('array')
            links.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('quality')
                expect(item).to.has.property('host')
                expect(item).to.has.property('link')
            })
        })

        it('should return an array of download links which has quality, host, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../Fansubs/Kusonime')
            const links = await Kusonime.links('/kenja-no-mago-batch-subtitle-indonesia/')

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
        it('should return an array of episodes which has episode, title, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../Fansubs/Kusonime')
            const list = await Kusonime.newReleases()

            expect(list).to.be.an('array')
            list.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('title')
                expect(item).to.has.property('link')
                expect(item).to.has.property('raw_link')
            })
        })
    })
})