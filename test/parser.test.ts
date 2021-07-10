import chai from 'chai'

process.env.HEADLESS = 'true'

import ParserManager from '../src/parsers/ParserManager'

const assert = chai.assert

describe('Parser', function () {
    this.timeout(30000)

    describe('#Teknoku', function () {
        it('should return http://www.solidfiles.com/v/YLk8g75DVPBDV', async function () {
            const resp = await ParserManager.parse('https://teknoku.me/?id=bm0rNDB1VDROMWFUaEpyRVk5WlFwb3V2Mm1ESktrSFZ6bHRmRndlMnJxSUdOMnpnWlRGR3VLaWh5bGhtU01Mag==')

            assert.equal(resp.parsed, 'http://www.solidfiles.com/v/YLk8g75DVPBDV')
        })

        it('should return https://drive.google.com/uc?id=1c0VAqq2cCZagej7hu7y9yZR0WREo_BL6&export=download', async function () {
            const resp = await ParserManager.parse('https://teknoku.me/?id=Y2VhdXRnbUhaWFhRUlBiQkt0bzExbEVsR0ZrVVNXdTN1MEc5RDg0YVl0ZE9nbkVmTUhhUWx2VDJpbjlGalpuNFo3UWxka0d6bG9rMUdsR1hhRUNhRGNsczBKK2hnOHduWmlXUWNPQm1Rc2cwRU91UmM2MlYvQmhBT3F1b2xrQ0JaRHZlNEJlVFQ1SHBJaWNOcjI5c1BGa0UrS3BJZUFRcDdJSmNFYVJZSFp5WjQ4K2pPVnJmN3Q5WUI4dmVobExIU1A4aEVFaFNuS3VYTTV3emJqZUZqdz09')

            assert.equal(resp.parsed, 'https://drive.google.com/uc?id=1c0VAqq2cCZagej7hu7y9yZR0WREo_BL6&export=download')
        })

        it('should return https://www38.zippyshare.com/v/SYL4xAP5/file.html', async function () {
            const resp = await ParserManager.parse('https://teknoku.me/?id=VUIweGZyYlVwOUJPdzNoSHF2ZFY1MUFyUW4wT2VuMmczVU5Jd1AwZThLK0wrdW9uaXhWcC9NaDcyRDNSenBRaDMxSDlDWlJyaDR0RFpqdUxUb0lmU2c9PQ==')

            assert.equal(resp.parsed, 'https://www38.zippyshare.com/v/SYL4xAP5/file.html')
        })
    })
})
