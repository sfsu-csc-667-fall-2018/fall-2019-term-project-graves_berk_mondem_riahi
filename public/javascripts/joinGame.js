let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);
let guestOrHost = "";
let socket = io();

// console.log("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

fetch("/games/" + roomId + "/getGuest").then(response => {
  response.json().then(response => {
    console.log(response["guestOrHost"]);
    guestOrHost = response["guestOrHost"];

    //console.log(response);
    //socket.emit("guestJoin", { userId: response["userId"], roomId: roomId });
    $(".guestName").append($("<li>").text(response["username"]));
  });
});

//get the hosts name
fetch("/games/" + roomId + "/getHost").then(response => {
  instantiateSocket();
  response.json().then(response => {
    //connect the socket to the rooms namespace
    //socket.emit("hostTest", "asd");
    console.log(response["userId"] + roomId);

    if (guestOrHost == "host") {
      console.log("trying to join host socket room");
      socket.emit("hostJoin", { userId: response["userId"], roomId: roomId });
    } else if (guestOrHost == "guest") {
      console.log("trying to join guest socket room");
      socket.emit("guestJoin", { userId: response["userId"], roomId: roomId });
    }

    $(".hostName").append($("<li>").text(response["username"]));
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
  console.log("ass");
  $.post(roomId + "/deal", function(res) {});
});

function instantiateSocket() {
  socket.emit("joinRoom", roomId);

  socket.on("deal", hand => {
    for (let i = 0; i < hand.length; i++) {
      //see if we can get this to show up in html

      console.log(cardIdentify(hand[i]));

      $("#cardUser" + i).append(
        $("<img src ='/cards/" + hand[i] + ".jpg'></img>")
      );
      $("#cardOpponent" + i).append($("<img src ='/cards/back.jpg'></img>"));
    }

    // $("#cardHost1").append($("<img src ='/cards/0.jpg'></img>"));
    $("#deal").remove();
    $("#messageBox").remove();
  });

  socket.on("hostTest", function() {
    console.log("recieved the host test");
  });

  //something here for drawing maybe
  // socket.on('displayCard',card)
}

//this is how the server knows to do some card bullshit now
function dealCards() {
  // socket.emit("deal", roomId);
}

//testing img name for card id
