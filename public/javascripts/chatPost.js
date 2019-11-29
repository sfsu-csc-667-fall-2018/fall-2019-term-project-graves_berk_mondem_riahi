$(function () {
    var socket = io();
    $('form[name="messageForm"]').submit(function () {
        socket.emit('chat message', $('#message').val());
        $('#message').val('');
        return false;
    });
    socket.on('chat message', function (msg) {
        $('#messages').append($('<li>').text(msg));
        window.scrollTo(0, document.body.scrollHeight);
    });

    $('form[name="createRoomForm"]').submit(function () {
        socket.emit('create room', $('#room').val(), $('#password').val());
        $('#room').val('');
        $('#password').val('');
        return false;
    });
    socket.on('create room', function (room, password) {
        $('#roomList').append($('<li>').text("Room Name: " + room + " pass: " + password));
        //window.scrollTo(0, document.body.scrollHeight);
    });


});