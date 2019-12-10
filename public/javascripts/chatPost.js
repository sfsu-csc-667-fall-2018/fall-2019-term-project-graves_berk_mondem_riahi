//todo : remove all these repsonsibilities and defer them somewhere else

$(function() {
  var socket = io();

  socket.on("chat message", function(msg) {
    $("#messages").append($("<li>").text(msg));
    window.scrollTo(0, document.body.scrollHeight);
  });
});

function joinRoom(roomName) {
  console.log("joining room " + roomName);
}
