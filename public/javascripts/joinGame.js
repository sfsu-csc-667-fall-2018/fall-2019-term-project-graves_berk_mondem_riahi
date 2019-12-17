let url = window.location.href;
const roomId = url.substring(url.lastIndexOf("/") + 1, url.length);
let guestOrHost = "";
let socket = io();
let hand = [];

// console.log("/" + roomId);

// socket = io("/" + roomId);
//have this socket join this room

fetch("/games/" + roomId + "/getTopDiscard").then(response => {
  // if (response.length > 0) {
  response
    .json()
    .then(response => {
      if (response != undefined) {
      }

      $("#discard").append("<img src ='/cards/" + response + ".jpg'></img>");
    })
    .catch(error => {});
  // }
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

$("#knock").click(function() {
  $.post(roomId + "/knock", function(res) {});
});

$("#gin").click(function() {
  $.post(roomId + "/gin", function(res) {});
});

$("#bigGin").click(function() {
  $.post(roomId + "/bigGin", function(res) {});
});

$("#dealButton").click(function() {
  $.post(roomId + "/deal", function(res) {});
});

$("#endGameButton").click(function() {
  $.post(roomId + "/endGame", function(res) {});
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
    // console.log("rendering hand");
    // console.log(hand);
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

  socket.on("displayMelds", meldData => {
    // console.log(meldData.deadwoodValue);
    // console.log("displayin them melds son");

    $("#runs").empty();
    $("#sets").empty();
    $("#deadwoodVal").empty();

    //replace the runs and sets with actual card names
    for (let i = 0; i < meldData.runs.length; i++) {
      for (let j = 0; j < meldData.runs[i].length; j++) {
        meldData.runs[i][j] = cardIdentify(meldData.runs[i][j]);
      }
    }

    for (let i = 0; i < meldData.sets.length; i++) {
      for (let j = 0; j < meldData.sets[i].length; j++) {
        meldData.sets[i][j] = cardIdentify(meldData.sets[i][j]);
      }
    }

    for (let i = 0; i < meldData.runs.length; i++) {
      $("#runs").append("<li> " + meldData.runs[i] + " </li><br></br>");
    }

    for (let i = 0; i < meldData.sets.length; i++) {
      $("#sets").append("<li> " + meldData.sets[i] + " </li> <br></br>");
    }

    $("#deadwoodVal").append("<p> " + meldData.deadwoodValue + " </p>");
  });

  socket.on("updateScores", scores => {
    $("#hostScore").empty();
    $("#guestScore").empty();
    $("#hostScore").append($("<td> " + scores[0] + "</td>"));
    $("#guestScore").append($("<td> " + scores[1] + "</td>"));
  });

  socket.on("showHands", hands => {
    //user hand is index 0
    //opponent hand is index 1

    for (let i = 0; i < hands[0].length; i++) {
      $("#cardUser" + i).empty();

      $("#cardUser" + i).append(
        $("<img src ='/cards/" + hands[0][i] + ".jpg'></img>")
      );
    }

    for (let i = 0; i < hands[1].length; i++) {
      $("#cardOpponent" + i).empty();

      $("#cardOpponent" + i).append(
        $("<img src ='/cards/" + hands[1][i] + ".jpg'></img>")
      );
    }
  });
}
