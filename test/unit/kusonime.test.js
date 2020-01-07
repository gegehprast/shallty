/* eslint-disable no-undef */
const expect = require('chai').expect
const Browser = require('../../services/Browser')

describe('kusonime', function () {
    describe('anime list', function () {
        it('should return an array of anime list which has title, link, raw link, and is batch', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../services/Kusonime')
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
            const Kusonime = require('../../services/Kusonime')
            const links = await Kusonime.links('%2Ftiger-mask-w-batch-subtitle-indonesia%2F')

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
            const Kusonime = require('../../services/Kusonime')
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


    describe('shortlink', function () {
        it('should return an object which has a string url property', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kusonime = require('../../services/Kusonime')
            const data = await Kusonime.semrawut('https%3A%2F%2Fjelajahinternet.me%2Ffull%2F%3Fapi%3Da43e9781fc804e34814e29bf4c2bb518989da6ad%26url%3Dhttps%253A%252F%252Facefile.co%252Ff%252F16742192%252Fkusonime-topeng-macan-w-001-020-360p-rar%26type%3D2')

            expect(data).to.be.an('object')
            expect(data).to.has.property('url')
            expect(data.url).to.be.a('string')
            expect(data.url).to.equal('https://acefile.co/f/16742192/kusonime-topeng-macan-w-001-020-360p-rar')
        })
    })
})