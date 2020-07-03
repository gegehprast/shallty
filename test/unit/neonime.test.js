/* eslint-disable no-undef */
require('dotenv').config()
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('neonime', function () {
    describe('episodes', function () {
        it('should return an array of episodes which has episode, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Neonime = require('../../Fansubs/Neonime')
            const episodes = await Neonime.episodes('%2Ftvshows%2Fa-i-c-o-incarnation-subtitle-indonesia%2F')

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
            const Neonime = require('../../Fansubs/Neonime')
            const links = await Neonime.links('/gleipnir-1x4-subtitle-indonesia/')

            expect(links).to.be.an('array')
            links.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('quality')
                expect(item).to.has.property('host')
                expect(item).to.has.property('link')
            })
        })
    })

    describe('batch links', function () {
        it('should return an array of download links which has quality, host, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Neonime = require('../../Fansubs/Neonime')
            const links = await Neonime.links('%2Fbatch%2Fakame-ga-kill-bd-batch-subtitle-indonesia%2F')

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
            const Neonime = require('../../Fansubs/Neonime')
            const list = await Neonime.newReleases()

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