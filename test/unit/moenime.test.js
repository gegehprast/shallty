/* eslint-disable no-undef */
require('dotenv').config()
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('moenime', function () {
    describe('anime list', function() {
        it('should return an array of anime list with title, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Moenime = require('../../Fansubs/Moenime')
            const list = await Moenime.animeList()

            expect(list).to.be.an('array')
            expect(list).to.not.be.empty
            list.forEach(anime => {
                expect(anime).to.be.an('object')
                expect(anime).to.has.property('title')
                expect(anime).to.has.property('link')
                expect(anime).to.has.property('raw_link')
            })
        })
    })

    describe('episodes', function () {
        it('should return an object which has array of episodes each with its own quality, host, and link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Moenime = require('../../Fansubs/Moenime')
            const episodes = await Moenime.episodes('%2Fabsolute-duo-sub-indo%2F')

            expect(episodes).to.be.an('object')
            expect(episodes).to.not.be.empty
            for (let episode in episodes) {
                if (episodes.hasOwnProperty(episode)) {
                    expect(episodes[episode]).to.be.an('array')
                    episodes[episode].forEach(file => {
                        expect(file).to.has.property('quality')
                        expect(file).to.has.property('host')
                        expect(file).to.has.property('link')
                    })
                }
            }
        })
    })

    describe('new releases', function () {
        it('should return an array of anime list with episode, title, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Moenime = require('../../Fansubs/Moenime')
            const list = await Moenime.newReleases()

            expect(list).to.be.an('array')
            expect(list).to.have.lengthOf(12)
            list.forEach(anime => {
                expect(anime).to.be.an('object')
                expect(anime).to.has.property('episode')
                expect(anime).to.has.property('title')
                expect(anime).to.has.property('link')
                expect(anime).to.has.property('raw_link')
            })
        })
    })
})