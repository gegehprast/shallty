/* eslint-disable no-undef */
require('dotenv').config()
const expect = require('chai').expect
const Browser = require('../../Browser')

describe('kiryuu', function () {
    describe('manga list', function () {
        it('should return an array of manga list which has title, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kiryuu = require('../../Fanscans/Kiryuu')
            const list = await Kiryuu.mangaList()

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

    describe('manga info', function () {
        it('should return an object which has title, cover, alterate title, synopsis, and author', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kiryuu = require('../../Fanscans/Kiryuu')
            const data = await Kiryuu.mangaInfo('%2Fmanga%2Firon-ladies%2F')

            expect(data).to.be.an('object')
            expect(data).to.has.property('title')
            expect(data).to.has.property('cover')
            expect(data).to.has.property('alternate_title')
            expect(data).to.has.property('synopsis')
            expect(data).to.has.property('author')
        })
    })

    describe('manga chapters', function () {
        it('should return an array of chapters which has chapter, link, and raw link', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kiryuu = require('../../Fanscans/Kiryuu')
            const data = await Kiryuu.chapters('%2Fmanga%2Firon-ladies')

            expect(data).to.be.an('array')
            data.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('chapter')
                expect(item).to.has.property('link')
                expect(item).to.has.property('raw_link')
            })
        })
    })

    describe('chapter images', function () {
        it('should return an array of images which has index and url', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kiryuu = require('../../Fanscans/Kiryuu')
            const data = await Kiryuu.images('%2Firon-ladies-chapter-99-bahasa-indonesia%2F')

            expect(data).to.be.an('object')
            expect(data).to.has.property('chapter')
            expect(data).to.has.property('images')
            data.images.forEach(image => {
                expect(image).to.be.an('object')
                expect(image).to.has.property('index')
                expect(image).to.has.property('url')
            })
        })
    })

    describe('new releases', function () {
        it('should return an array of manga which has title, title url, raw title url, chapter, chapter url, raw chapter url', async function () {
            this.timeout(60000)
            await Browser.init()
            const Kiryuu = require('../../Fanscans/Kiryuu')
            const data = await Kiryuu.newReleases()

            expect(data).to.be.an('array')
            data.forEach(item => {
                expect(item).to.be.an('object')
                expect(item).to.has.property('title')
                expect(item).to.has.property('title_url')
                expect(item).to.has.property('raw_title_url')
                expect(item).to.has.property('chapter')
                expect(item).to.has.property('chapter_url')
                expect(item).to.has.property('raw_chapter_url')
            })
        })
    })
})