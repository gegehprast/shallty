/* eslint-disable */
const shortlink = io('/shortlink');

shortlink.on('parse', function (data) {
    console.log('parse: ', data)
})

function parseShortlink() {
    shortlink.emit('parse', {
        link: 'https://teknoku.me/?id=bm0rNDB1VDROMWFUaEpyRVk5WlFwb3V2Mm1ESktrSFZ6bHRmRndlMnJxSUdOMnpnWlRGR3VLaWh5bGhtU01Mag=='
    })

    shortlink.emit('parse', {
        link: 'https://teknoku.me/?id=Y2VhdXRnbUhaWFhRUlBiQkt0bzExbEVsR0ZrVVNXdTN1MEc5RDg0YVl0ZE9nbkVmTUhhUWx2VDJpbjlGalpuNFo3UWxka0d6bG9rMUdsR1hhRUNhRGNsczBKK2hnOHduWmlXUWNPQm1Rc2cwRU91UmM2MlYvQmhBT3F1b2xrQ0JaRHZlNEJlVFQ1SHBJaWNOcjI5c1BGa0UrS3BJZUFRcDdJSmNFYVJZSFp5WjQ4K2pPVnJmN3Q5WUI4dmVobExIU1A4aEVFaFNuS3VYTTV3emJqZUZqdz09'
    })

    shortlink.emit('parse', {
        link: 'https://teknoku.me/?id=VUIweGZyYlVwOUJPdzNoSHF2ZFY1MUFyUW4wT2VuMmczVU5Jd1AwZThLK0wrdW9uaXhWcC9NaDcyRDNSenBRaDMxSDlDWlJyaDR0RFpqdUxUb0lmU2c9PQ=='
    })
}
