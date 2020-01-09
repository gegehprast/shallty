/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('neonime', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })

    describe('episodes', function () {
        it('should return 200 and an array of episodes which has episode, link, and raw link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/neonime/episodes?link=%2Ftvshows%2Fa-i-c-o-incarnation-subtitle-indonesia%2F')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('episode')
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

    describe('links', function () {
        it('should return 200 and an array of download links which has quality, host, and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/neonime/links?link=%2Fepisode%2Fa-i-c-o-incarnation-1x12')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('quality')
                        expect(item).to.has.property('host')
                        expect(item).to.has.property('link')
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

    describe('batch links', function () {
        it('should return 200 and an array of download links which has quality, host, and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/neonime/links?link=%2Fbatch%2Fakame-ga-kill-bd-batch-subtitle-indonesia%2F')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('quality')
                        expect(item).to.has.property('host')
                        expect(item).to.has.property('link')
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
        it('should return 200 and an array of episodes which has episode, title, link, and raw link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/neonime/newReleases')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
                    res.body.data.forEach(item => {
                        expect(item).to.be.an('object')
                        expect(item).to.has.property('episode')
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
})