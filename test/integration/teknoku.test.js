/* eslint-disable no-undef */
const supertest = require('supertest'),
    expect = require('chai').expect,
    app = require('../../index.js')

describe('teknoku', function () {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })
    
    describe('parse', function () {
        it('should return 200 and a string of url', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/moenime/shortlink?link=https%3A%2F%2Fteknoku.me%2F%3Fid%3DcWFkTnBBZlEvZ1NvUHdYUGNkQ1ZPeGNnb0pjK2s1VDJWY2dlakh2Ykwrbjk0VkRUVGR2bWZwSHNpbVFVZUdhSjNTYUhySnBsS05jN2NmUHMzTk1BMWc9PQ%3D%3D')
                .expect(200)
                .expect(function (res) {
                    expect(res.body.status).to.equal(200)
                    expect(res.body.message).to.equal('Success')
                    expect(res.body.data).to.be.an('object')
                    expect(res.body.data).to.has.property('url')
                    expect(res.body.data.url).to.be.a('string')
                    expect(res.body.data.url).to.equal('https://www60.zippyshare.com/v/dpn65heR/file.html')
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