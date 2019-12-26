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
            supertest(app).get('/api/moenime/episodes?link=/kandagawa-jet-girls-sub-indo/')
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

    describe('teknoku', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/moenime/teknoku?link=https%3A%2F%2Fteknoku.me%2F%3Fid%3DcWFkTnBBZlEvZ1NvUHdYUGNkQ1ZPeGNnb0pjK2s1VDJWY2dlakh2Ykwrbjk0VkRUVGR2bWZwSHNpbVFVZUdhSjNTYUhySnBsS05jN2NmUHMzTk1BMWc9PQ%3D%3D')
                .expect(200)
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