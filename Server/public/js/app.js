/* eslint-disable */
const socket = io('/');
const fansub = io('/fansub');
const fanscan = io('/fanscan');
const shortlink = io('/shortlink');

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

fanscan.on('mangaList', function (data) {
    console.log('mangaList: ', data)
})

fanscan.on('mangaInfo', function (data) {
    console.log('mangaInfo: ', data)
})

fanscan.on('chapters', function (data) {
    console.log('chapters: ', data)
})

fanscan.on('images', function (data) {
    console.log('images: ', data)
})

fanscan.on('newReleases', function (data) {
    console.log('newReleases: ', data)
})

shortlink.on('parse', function (data) {
    console.log('parse: ', data)
})

function animeList() {
    fansub.emit('animeList', {
        fansub: 'moenime'
    })
}

function episodes() {
    fansub.emit('episodes', {
        fansub: 'neonime',
        link: '/tvshows/black-clover-subtitle-indonesia/'
    })
}

function downloadLinks() {
    fansub.emit('links', {
        fansub: 'neonime',
        link: '/episode/black-clover-1x112/'
    })
}

function newReleases() {
    fansub.emit('newReleases', {
        fansub: 'moenime'
    })
}

function mangaList() {
    fanscan.emit('mangaList', {
        fanscan: 'kiryuu'
    })
}

function mangaInfo() {
    fanscan.emit('mangaInfo', {
        fanscan: 'kiryuu',
        link: '%2Fmanga%2Firon-ladies%2F'
    })
}

function chapters() {
    fanscan.emit('chapters', {
        fanscan: 'kiryuu',
        link: '%2Fmanga%2Firon-ladies%2F'
    })
}

function images() {
    fanscan.emit('images', {
        fanscan: 'kiryuu',
        link: '%2Firon-ladies-chapter-99-bahasa-indonesia%2F'
    })
}

function newReleasesManga() {
    fansub.emit('newReleases', {
        fansub: 'kiryuu'
    })
}

function parseShortlink() {
    shortlink.emit('parse', {
        link: 'https%3A%2F%2Fneonime.org%2F%3F700ef7c050%3DdTZLZlFpRjVXNG9DNGhJS1NQUExvRDVSYS9zTWlIeWlLTGxTcy9VN0daVzBkNW9xRHNxaXhFc2x5WDFabFNUVllaUElOTkF5R05UQXJYUjNTTURjQnJwZ3BGSkVHYXdRRGxDeEFFVmRhR1FaWHpMemN2ZW5yODJrTGF1bHVBNDhGREIwV1B4d1dhOHFSOS9KQzd2OUFBPT0%3D'
    })

    shortlink.emit('parse', {
        link: 'https%3A%2F%2Fneonime.org%2F%3F700ef7c050%3DdTZLZlFpRjVXNG9DNGhJS1NQUExvTEJoU243aU5pSDU5MUxRak9wckdNY3JaYTZnU1NyQnBvQkRnUHBsRmw2WUdCamFCZmkvdnh4VHVUWDc4SXk1dUE9PQ%3D%3D'
    })

    shortlink.emit('parse', {
        link: 'https%3A%2F%2Fneonime.org%2F%3F700ef7c050%3DdTZLZlFpRjVXNG9DNGhJS1NQUExvRnJlVVM3QTJlYzJGcTBoV1kxWGorOEpMTDAyakdxbmZLZWc3ektQT2lyUjFUc1VzM1JZU0x3SjA5UWptU25IejFLUU9IL0VMTWpscTFWTUlLaXlpcFdwRXBnYVN6WHArWWNRYXVteDB6dmY%3D'
    })
}