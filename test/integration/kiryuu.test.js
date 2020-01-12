/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('kiryuu', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })
    
    describe('manga list', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/mangaList')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    expect(res.body.data).to.not.be.empty
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('title')
                        expect(item).to.has.property('link')
                        expect(item).to.has.property('raw_link')
                    })
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('manga info', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/mangaInfo?link=%2Fmanga%2Firon-ladies%2F')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('title')
                    expect(res.body.data).to.has.property('cover')
                    expect(res.body.data).to.has.property('alternate_title')
                    expect(res.body.data).to.has.property('synopsis')
                    expect(res.body.data).to.has.property('author')
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('manga chapters', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/chapters?link=%2Fmanga%2Firon-ladies')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('chapter')
                        expect(item).to.has.property('link')
                        expect(item).to.has.property('raw_link')
                    })
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('chapter images', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/images?link=%2Firon-ladies-chapter-99-bahasa-indonesia%2F')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('chapter')
                    expect(res.body.data).to.has.property('images')
                    res.body.data.images.forEach(image => {
                        expect(image).to.be.an('object')
                        expect(image).to.has.property('index')
                        expect(image).to.has.property('url')
                    })
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('new releases', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kiryuu/newReleases')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('title')
                        expect(item).to.has.property('title_url')
                        expect(item).to.has.property('raw_title_url')
                        expect(item).to.has.property('chapter')
                        expect(item).to.has.property('chapter_url')
                        expect(item).to.has.property('raw_chapter_url')
                    })
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })
})