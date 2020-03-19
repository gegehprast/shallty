/* eslint-disable */
$(function () {
    const socket = io('/');

    socket.on('a', function (data) {
        console.log('A: ', data)
    })

    socket.on('b', function (data) {
        console.log('B: ', data)
    })

    function emitA() {
        socket.emit('a', {
            msg: 'this is A'
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