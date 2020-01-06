/* eslint-disable no-undef */
const supertest = require('supertest'),
    app = require('../../index.js')

describe('home page', () => {
    before(function (done) {
        this.timeout(5000)
        setTimeout(done, 3000)
    })
    
    it('should return 200', (done) => {
        supertest(app)
            .get('/')
            .expect(200)
            .end(done)
    })
})