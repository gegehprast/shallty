/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('oploverz', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })

    describe('anime list', function () {
        it('should return 200 and an array of anime list which has title and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/oploverz/animeList')
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

    describe('episodes', function () {
        it('should return 200 and an array of episodes which has episode and link', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/oploverz/episodes?link=%2Fseries%2F3d-kanojo-real-girl-s2%2F')
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
            supertest(app).get('/api/oploverz/links?link=%2F3d-kanojo-real-girl-s2-12-subtitle-indonesia-end%2F')
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
            supertest(app).get('/api/oploverz/newReleases')
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

    describe('shortlink', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/oploverz/shortlink?link=https%3A%2F%2Fkontenajaib.xyz%2F%3Fid%3DWWI3dG5VNlRiUUoyVUdOcEpnZ0kxL3lRck5zZlAweVFwdzBUOGpiTDdZSWhNTGtvMjNEYjVTMjdMcUFDNjl5ZUxCbWJaUlZYM2FSalhuQlorVStsMENuWjAzQ2FON05jM2Rtc05pYUQ2VTV0a01YUXJvQ1M0U1d3L0t4bzQrWFFCLzZjNDMwWnJqdlk0dXoxYndBcHdSUzNmZUthVGhRcWFWRGFrWDkyeFdEZjJMNWRWbkFNbGZLdE8xSS9admcyZUZuMGl6MDQzN0V2TGxaQmlsZGNQSjd3SkZTSFEvd291em5IektjTkFZWjRqbUdweFVDcEFFLytnUkgwNC92SXdXeWpEeHliTCtTbzQyOFZBWk9iMWE1NE5xdWVHTWNkc1I3Z2R2YmxSSnJVQ3haeHV5V0UxY2NqcVNnZFM4SlJmQXRaWGVsVS9RVXFPZmprODNkc1EzTGQ4V2NEcENHZU5pajkxSnVFNmlZPQ%3D%3D')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.equal('https://drive.google.com/file/d/1eoR2pnJpuygsi8nwOlcft8jL502ppMiE/view')
                })
                .end(function (err, res) {
                    if (err) {
                        console.log(res.body)
                        return done(err)
                    }
                    done()
                })
        })

        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/oploverz/shortlink?link=https%3A%2F%2Fhexafile.net%2Fu3CSw')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.equal('https://www63.zippyshare.com/v/ACM44jzR/file.html')
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