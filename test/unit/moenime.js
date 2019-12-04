/* eslint-disable no-undef */
const expect = require('chai').expect
const Browser = require('../../services/Browser')
const Moenime = require('../../services/Moenime')
let moenime, animeList

describe('moenime', function () {
    before(async function () {
        this.timeout(5000)
        await Browser.init()
        moenime = new Moenime(Browser)
    })

    describe('anime list', function() {
        it('should return an array', async function () {
            this.timeout(60000)
            animeList = await moenime.animeList()
            expect(animeList).to.be.an('array')
        })

        it('should has object(s) which has link and title properties', function () {
            animeList.forEach(anime => {
                expect(anime).to.be.an('object')
                expect(anime).to.has.property('link')
                expect(anime).to.has.property('title')
            })
        })
    })
})