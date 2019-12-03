/* eslint-disable no-undef */
const supertest = require('supertest'),
    app = require('../../index.js')


describe('kiryuu when the crawler is not ready', function () {
    describe('manga list', function () {
        it('should return 500', function (done) {
            supertest(app).get('/api/kiryuu/mangaList')
                .expect(500)
                .end(done)
        })
    })

    describe('manga info', function () {
        it('should return 500', function (done) {
            supertest(app).get('/api/kiryuu/mangaInfo?link=%2Fmanga%2Firon-ladies%2F')
                .expect(500)
                .end(done)
        })
    })

    describe('manga chapters', function () {
        it('should return 500', function (done) {
            supertest(app).get('/api/kiryuu/chapters?link=%2Fmanga%2Firon-ladies')
                .expect(500)
                .end(done)
        })
    })

    describe('chapter images', function () {
        it('should return 500', function (done) {
            supertest(app).get('/api/kiryuu/images?link=%2Firon-ladies-chapter-99-bahasa-indonesia%2F')
                .expect(500)
                .end(done)
        })
    })

    describe('new release', function () {
        it('should return 500', function (done) {
            supertest(app).get('/api/kiryuu/newReleases')
                .expect(500)
                .end(done)
        })
    })
})

describe('kiryuu when the crawler is ready', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })

    describe('manga list', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/mangaList')
                .expect(200)
                .end(done)
        })
    })

    describe('manga info', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/mangaInfo?link=%2Fmanga%2Firon-ladies%2F')
                .expect(200)
                .end(done)
        })
    })

    describe('manga chapters', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/chapters?link=%2Fmanga%2Firon-ladies')
                .expect(200)
                .end(done)
        })
    })

    describe('chapter images', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/images?link=%2Firon-ladies-chapter-99-bahasa-indonesia%2F')
                .expect(200)
                .end(done)
        })
    })

    describe('new release', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/newReleases')
                .expect(200)
                .end(done)
        })
    })
})