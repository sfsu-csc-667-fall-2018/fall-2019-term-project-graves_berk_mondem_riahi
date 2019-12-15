let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);

let socket = io();

// console.log("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

//get the hosts name
fetch("/games/" + roomId + "/getHost").then(response => {
  instantiateSocket();
  response.json().then(response => {
    //connect the socket to the rooms namespace
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
      "/deal ' method ='POST'> <button type = 'submit' onclick = 'dealCards()'> deal </button> </form> "
  )
);

function instantiateSocket() {
  // socket = io("/" + roomId);
  socket.emit("createRoom", roomId);
  // socket.emit("test");

  socket.on("test", function(room) {
    console.log("yeeeee " + room);
  });

  socket.on("deal", hand => {
    for (let i = 0; i < hand.length; i++) {
      console.log(hand[i]);
    }
    $("#deal").remove();
  });
}

//this is how the server knows to do some card bullshit now
function dealCards() {
  // socket.emit("deal", roomId);
}
