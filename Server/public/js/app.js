/* eslint-disable */
const socket = io('/');
const fansub = io('/fansub');
const fantl = io('/fantl');

fansub.on('animeList', function (data) {
    console.log('animeList: ', data)
})

fansub.on('episodes', function (data) {
    console.log('episodes: ', data)
})

fansub.on('links', function (data) {
    console.log('links: ', data)
})

fansub.on('newReleases', function (data) {
    console.log('newReleases: ', data)
})

function animeList() {
    fansub.emit('animeList', {
        fansub: 'moenime'
    })
}

function episodes() {
    fansub.emit('episodes', {
        fansub: 'neonime'
    })
}

function links() {
    fansub.emit('links', {
        fansub: 'moenime'
    })
}

function newReleases() {
    fansub.emit('newReleases', {
        fansub: 'moenime'
    })
}