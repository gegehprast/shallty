/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('kusonime', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })

    describe('anime list', function () {
        it('should return 200 and an array of anime list which has title and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kusonime/animeList')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
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

    describe('links', function () {
        it('should return 200 and an array of download links which has quality, host, and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kusonime/links?link=%2Ftiger-mask-w-batch-subtitle-indonesia%2F')
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
        it('should return 200 and an array of episodes which has episode, title, and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kusonime/newReleases')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('array')
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

    describe('shortlink', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/kusonime/shortlink?link=https%3A%2F%2Fjelajahinternet.me%2Ffull%2F%3Fapi%3Da43e9781fc804e34814e29bf4c2bb518989da6ad%26url%3Dhttps%253A%252F%252Facefile.co%252Ff%252F16742192%252Fkusonime-topeng-macan-w-001-020-360p-rar%26type%3D2')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.equal('https://acefile.co/f/16742192/kusonime-topeng-macan-w-001-020-360p-rar')
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