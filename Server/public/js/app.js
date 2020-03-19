/* eslint-disable */
$(function () {
    const socket = io('/');
    const fansub = io('/fansub');

    socket.on('a', function (data) {
        console.log('A: ', data)
    })

    socket.on('b', function (data) {
        console.log('B: ', data)
    })

    function emitA() {
        fansub.emit('animeList', {
            fansub: 'Moenime'
        })
    }

    function emitB() {
        socket.emit('b', {
            msg: 'this is B'
        })
    }

    $("#emitA").click(function () {
        emitA()
    })
    $("#emitB").click(function () {
        emitB()
    })
});