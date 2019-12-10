//todo : remove all these repsonsibilities and defer them somewhere else

$(function() {
  var socket = io();

  socket.on("create room", function(room) {
    let buttonTag =
      "<button onClick = 'joinRoom(" + '"' + room + '"' + ")' > Join";
    $("#roomList").append(" <li> Room: <a href => " + room);
  });
});
