/* eslint-disable no-undef */
const supertest = require('supertest'),
    app = require('../../index.js')

describe('moenime', function () {
    describe('anime list', function () {
        it('should return 200', function (done) {
            this.timeout(60000)
            supertest(app).get('/api/moenime/animeList')
                .expect(200)
                .end(done)
        })
    })
})