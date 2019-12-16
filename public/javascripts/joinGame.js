let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);
let guestOrHost = "";
let socket = io();
let hand = [];

// console.log("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

fetch("/games/" + roomId + "/getTopDiscard").then(response => {
  response.json().then(response => {
    $("#discard").append("<img src ='/cards/" + response + ".jpg'></img>");
  });
});

fetch("/games/" + roomId + "/getHand").then(response => {
  response.json().then(response => {
    console.log("got this from the hand");
    console.log(response);
    hand = response;
    if (hand.length > 0) {
      $("#deal").remove();
    }

    for (let i = 0; i < hand.length; i++) {
      $("#cardUser" + i).append(
        $("<img src ='/cards/" + hand[i] + ".jpg'></img>")
      );
      $("#cardOpponent" + i).append($("<img src ='/cards/back.jpg'></img>"));
    }
  });
});

fetch("/games/" + roomId + "/getGuest").then(response => {
  response.json().then(response => {
    // console.log(response["guestOrHost"]);
    // guestOrHost = response["guestOrHost"];

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
    // console.log(response["userId"] + roomId);

    console.log(response["guestOrHost"]);
    guestOrHost = response["guestOrHost"];

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

$("#dealButton").click(function() {
  $.post(roomId + "/deal", function(res) {});
});

$("#deckCard").click(function() {
  $.post(roomId + "/draw", function(res) {});
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

  socket.on("discard", card => {
    $("#discard").append("<img src ='/cards/" + card + ".jpg'></img>");
  });

  socket.on("draw", hand => {
    // console.log("drew a card boi");
    //empty all the children of all card classes for the user

    for (let i = 0; i < 11; i++) {
      $("#cardUser" + i).empty();

      $("#cardUser" + i).append(
        $("<img src ='/cards/" + hand[i] + ".jpg'></img>")
      );
    }
  });

  // socket.on("hostTest", function() {
  //   console.log("recieved the host test");
  // });

  //something here for drawing maybe
  // socket.on('displayCard',card)
}

//this is how the server knows to do some card bullshit now
function dealCards() {
  // socket.emit("deal", roomId);
}

// function drawFromDeck() {
//   console.log("toucha the deck ;)");
// }

//im sorry john look away your pure eyes musn't look upon such filth
function card0Discard() {
  console.log("yeet");
}
function card1Discard() {
  console.log("yeet");
}
function card2Discard() {
  console.log("yeet");
}
function card3Discard() {
  console.log("yeet");
}
function card4Discard() {
  console.log("yeet");
}
function card5Discard() {
  console.log("yeet");
}
function card6Discard() {
  console.log("yeet");
}
function card7Discard() {
  console.log("yeet");
}
function card8Discard() {
  console.log("yeet");
}
function card9Discard() {
  console.log("yeet");
}
function card10Discard() {
  console.log("yeet");
}

//testing img name for card id
