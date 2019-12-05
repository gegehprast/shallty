/* eslint-disable no-undef */
const supertest = require('supertest'),
    app = require('../../index.js')

describe('moenime', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })
    
    describe('anime list', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/moenime/animeList')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })

    describe('episodes', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/moenime/episodes?link=%2Fabsolute-duo-sub-indo%2F')
                .expect(200)
                .end(function(err, res) {
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
            supertest(app).get('/api/moenime/newReleases')
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })
    })
})