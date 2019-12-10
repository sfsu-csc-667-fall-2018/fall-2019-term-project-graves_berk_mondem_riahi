//todo : remove all these repsonsibilities and defer them somewhere else

$(function () {
  var socket = io();
  $('form[name="messageForm"]').submit(function () {
    socket.emit("chat message", $("#message").val());
    $("#message").val("");
    return false;
  });
  socket.on("chat message", function (msg, time) {
    $("#messages").append($("<li>").text(time + " - " + msg));
    window.scrollTo(0, document.body.scrollHeight);
  });

  $('form[name="createRoomForm"]').submit(function () {
    socket.emit("create room", $("#room").val(), $("#password").val());
    $("#room").val("");
    $("#password").val("");
    return false;
  });

  socket.on("create room", function (room, password) {
    let buttonTag = "<button onClick = 'joinRoom(" + '"' + room + '"' + ")' > Join";
    $("#roomList").append("<li > " + "Room Name: " + room + buttonTag);
  });
});


function joinRoom(roomName) {
  console.log("joining room " + roomName)
}