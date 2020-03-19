/* eslint-disable */
$(function () {
    const socket = io('/');
    const fansub = io('/fansub');
    const fantl = io('/fantl');

    socket.on('a', function (data) {
        console.log('A: ', data)
    })

    socket.on('b', function (data) {
        console.log('B: ', data)
    })

    function emitA() {
        fansub.emit('animeList', {
            fansub: 'moenime'
        })
    }

    function emitB() {
        fantl.emit('mangaList', {
            fansub: 'kiryuu'
        })
    }

    $("#emitA").click(function () {
        emitA()
    })
    $("#emitB").click(function () {
        emitB()
    })
});