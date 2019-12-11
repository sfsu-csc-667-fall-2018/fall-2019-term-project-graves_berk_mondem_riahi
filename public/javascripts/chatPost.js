//todo : remove all these repsonsibilities and defer them somewhere else

$(function() {
  var socket = io();

  socket.on("chat message", function(msg) {
    $("#messages").append($("<li>").text(msg));
    window.scrollTo(0, document.body.scrollHeight);
    document.getElementById("message").value = "";
  });

  socket.on("create room", function(room, id) {
    $("#roomList").append(" <li> Room: <a href = games/" + id + "> " + room);
    document.getElementById("roomName").value = "";
    document.getElementById("roomPassword").value = "";
    document.getElementById("roomId").value = "";
  });

  socket.on("join lobby", function(messages) {
    for (let i = 0; i < messages.length; i++) {
      console.log("JOINING LOBBY");
      $("#messages").append($("<li>").text(messages[i]));
    }
  });
});
