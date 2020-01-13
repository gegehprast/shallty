/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('shortlink', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })
    
    describe('teknoku', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fteknoku.me%2F%3Fid%3DcWFkTnBBZlEvZ1NvUHdYUGNkQ1ZPeGNnb0pjK2s1VDJWY2dlakh2Ykwrbjk0VkRUVGR2bWZwSHNpbVFVZUdhSjNTYUhySnBsS05jN2NmUHMzTk1BMWc9PQ%3D%3D')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('zippyshare.com')
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

    describe('jelajahinternet', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fjelajahinternet.me%2Ffull%2F%3Fapi%3Da43e9781fc804e34814e29bf4c2bb518989da6ad%26url%3Dhttps%253A%252F%252Facefile.co%252Ff%252F16742192%252Fkusonime-topeng-macan-w-001-020-360p-rar%26type%3D2')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('acefile.co')
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

    describe('xmaster', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fxmaster.xyz%2F%3Fsitex%3DaHR0cHM6Ly9zZW5kaXQuY2xvdWQvN24zNXZlcGNibXpq')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('sendit.cloud')
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

    describe('kontenajaib', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fkontenajaib.xyz%2F%3Fid%3DWWI3dG5VNlRiUUoyVUdOcEpnZ0kxL3lRck5zZlAweVFwdzBUOGpiTDdZSWhNTGtvMjNEYjVTMjdMcUFDNjl5ZUxCbWJaUlZYM2FSalhuQlorVStsMENuWjAzQ2FON05jM2Rtc05pYUQ2VTV0a01YUXJvQ1M0U1d3L0t4bzQrWFFCLzZjNDMwWnJqdlk0dXoxYndBcHdSUzNmZUthVGhRcWFWRGFrWDkyeFdEZjJMNWRWbkFNbGZLdE8xSS9admcyZUZuMGl6MDQzN0V2TGxaQmlsZGNQSjd3SkZTSFEvd291em5IektjTkFZWjRqbUdweFVDcEFFLytnUkgwNC92SXdXeWpEeHliTCtTbzQyOFZBWk9iMWE1NE5xdWVHTWNkc1I3Z2R2YmxSSnJVQ3haeHV5V0UxY2NqcVNnZFM4SlJmQXRaWGVsVS9RVXFPZmprODNkc1EzTGQ4V2NEcENHZU5pajkxSnVFNmlZPQ%3D%3D')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('1eoR2pnJpuygsi8nwOlcft8jL502ppMiE')
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

    describe('hexa', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fhexafile.net%2Fu3CSw')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('zippyshare.com')
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

    describe('anjay', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=https%3A%2F%2Fanjay.info%2F%3Fid%3DVWErNWlBZmpCUlMvT0pxVHE3YS84bGJVZGkrVjNwejZLTnR2UmVxRVJxell2UmdXdzA4T2tDVjBNK3gzcWk3Lw%3D%3D')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('zippyshare.com')
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

    describe('coeg', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/shortlink?link=http%3A%2F%2Fcoeg.in%2Fd5uuo')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.include('solidfiles.com')
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