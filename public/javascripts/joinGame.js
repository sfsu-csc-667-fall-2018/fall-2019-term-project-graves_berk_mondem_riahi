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
    socket.emit("hostTest", "asd");
    console.log(response["userId"] + roomId);

    socket.emit("hostJoin", { userId: response["userId"], roomId: roomId });

    $(".hostName").append($("<li>").text(response["username"]));
  });
});

fetch("/games/" + roomId + "/getGuest").then(response => {
  response.json().then(response => {
    //console.log(response);
    $(".guestName").append($("<li>").text(response["username"]));
  });
});

// fetch("/games/" + roomId + "/deal").then(response => {
//   response.json().then(response => {
//     console.log(response);
//   });
// });

//creates the deal button
// $("#deal").append(
//   $(
//     " <form action = '" +
//       roomId +
//       "/deal ' method ='POST'> <button type = 'submit' onclick = 'dealCards()'> deal </button> </form> "
//   )
// );

$("#dealButton").click(function() {
  $.post(roomId + "/deal", function(res) {});
});

function instantiateSocket() {
  socket.emit("joinRoom", roomId);

  socket.on("deal", hand => {
    for (let i = 0; i < hand.length; i++) {
      console.log(cardIdentify(hand[i]));
    }
    $("#deal").remove();
    $("#messageBox").remove();
  });

  socket.on("hostTest", function() {
    console.log("recieved the host test");
  });
}

//this is how the server knows to do some card bullshit now
function dealCards() {
  // socket.emit("deal", roomId);
}
