let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);

let socket = io();
socket.emit("createRoom", roomId);

console.log("/" + roomId);
socket = io("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

//get the hosts name
fetch("/games/" + roomId + "/getHost").then(response => {
  response.json().then(response => {
    //console.log(response["username"]);
    $(".hostName").append($("<li>").text(response["username"]));
  });
});

fetch("/games/" + roomId + "/getGuest").then(response => {
  response.json().then(response => {
    //console.log(response);
    $(".guestName").append($("<li>").text(response["username"]));
  });
});

//creates the deal button
$("#deal").append(
  $(
    " <form action = '" +
      roomId +
      "/deal ' method ='POST'> <button type = 'submit'> deal </button> </form> "
  )
);

socket.on("test", function(room) {
  console.log("yeeeee");
});
