let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);
let guestOrHost = "";
let socket = io();
let hand = [];

// console.log("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

fetch("/games/" + roomId + "/getTopDiscard").then(response => {
  if (response.length > 0) {
    response.json().then(response => {
      if (response != undefined) {
      }
      $("#discard").append("<img src ='/cards/" + response + ".jpg'></img>");
    });
  }
});

fetch("/games/" + roomId + "/getHand").then(response => {
  response.json().then(response => {
    // console.log("got this from the hand");
    // console.log(response);
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

    // console.log(response["guestOrHost"]);
    guestOrHost = response["guestOrHost"];

    if (guestOrHost == "host") {
      // console.log("trying to join host socket room");
      socket.emit("hostJoin", { userId: response["userId"], roomId: roomId });
    } else if (guestOrHost == "guest") {
      // console.log("trying to join guest socket room");
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

$("#discard").click(function() {
  $.post(roomId + "/drawFromDiscard", function(res) {});
});

$("#cardUser0").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 0 }, function(res) {});
});
$("#cardUser1").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 1 }, function(res) {});
});
$("#cardUser2").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 2 }, function(res) {});
});
$("#cardUser3").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 3 }, function(res) {});
});
$("#cardUser4").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 4 }, function(res) {});
});
$("#cardUser5").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 5 }, function(res) {});
});
$("#cardUser6").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 6 }, function(res) {});
});
$("#cardUser7").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 7 }, function(res) {});
});
$("#cardUser8").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 8 }, function(res) {});
});
$("#cardUser9").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 9 }, function(res) {});
});
$("#cardUser10").click(function() {
  $.post(roomId + "/discardFromHand", { cardNum: 10 }, function(res) {});
});

//oh god look away

function instantiateSocket() {
  socket.emit("joinRoom", roomId);

  socket.on("deal", hand => {
    for (let i = 0; i < hand.length; i++) {
      //see if we can get this to show up in html

      // console.log(cardIdentify(hand[i]));

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
    $("#discard").empty();

    if (card != undefined) {
      $("#discard").append("<img src ='/cards/" + card + ".jpg'></img>");
    }
  });

  socket.on("draw", hand => {
    console.log("rendering hand");
    console.log(hand);
    // console.log("drew a card boi");
    //empty all the children of all card classes for the user
    let i = 0;
    for (i = 0; i < hand.length; i++) {
      $("#cardUser" + i).empty();

      $("#cardUser" + i).append(
        $("<img src ='/cards/" + hand[i] + ".jpg'></img>")
      );
    }

    $("#cardUser" + hand.length).empty();
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

//testing img name for card id
