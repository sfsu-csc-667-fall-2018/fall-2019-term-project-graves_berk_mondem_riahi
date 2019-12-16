const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");
const deck = require("../gameLogic/deck");
const serverSide = require("../gameLogic/serverSide");

/* GET home page. */
router.get("/:id", isLoggedIn, function(request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  //if we can get these we're golden
  let io = request.app.get("io");

  const roomId = request.params["id"];
  const userId = request.user.id;

  //check if the user is supposed to be in the lobby, or if it has two users already
  db.one("SELECT * FROM rooms WHERE room_id = $1", roomId)
    .then(_ => {
      // console.log(userId + " joined " + roomId);
      //add the user to the game
      joinGame(userId, roomId, io, response);
    })
    .catch(error => {
      //if the game room doesnt exist just send them back to the lobby
      console.log(error);
      response.redirect("/lobby");
    });

  var holder = deck.generateRandomDeck(); //todo  maybe rename deck.js file due to one already existing in models.
  for (let index = 0; index < holder.length; index++) {
    db.none("INSERT INTO decks(room_id,card_id) VALUES($1,$2)", [
      roomId,
      holder[index]
    ])
      .then(() => {
        //success
      })
      .catch(error => {
        //error
      });
  }

  //socket shit
});

router.post("/:id/knock", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");

  db.one("SELECT * FROM rooms WHERE room_id = $1", [roomId]).then(results => {
    let hostPlayerId = results["host_id"];
    let guestPlayerId = results["guest_id"];

    db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
      userId,
      roomId
    ]).then(results => {
      let playerIdOfButtonPusherPerson = results["player_id"];

      console.log(hostPlayerId);

      console.log(guestPlayerId);

      console.log(playerIdOfButtonPusherPerson);
    });
  });
});

router.post("/:id/bigGin", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");

  //testing delete room

  (async function() {
    await serverSide.deleteRoom(roomId);
  })();

  db.one("SELECT * FROM rooms WHERE room_id = $1", [roomId]).then(results => {
    let hostPlayerId = results["host_id"];
    let guestPlayerId = results["guest_id"];

    db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
      userId,
      roomId
    ]).then(results => {
      let playerIdOfButtonPusherPerson = results["player_id"];

      console.log(hostPlayerId);

      console.log(guestPlayerId);

      console.log(playerIdOfButtonPusherPerson);
    });
  });
});

router.post("/:id/gin", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");

  db.one("SELECT * FROM rooms WHERE room_id = $1", [roomId]).then(results => {
    let hostPlayerId = results["host_id"];
    let guestPlayerId = results["guest_id"];

    db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
      userId,
      roomId
    ]).then(results => {
      let playerIdOfButtonPusherPerson = results["player_id"];

      console.log(hostPlayerId);

      console.log(guestPlayerId);

      console.log(playerIdOfButtonPusherPerson);
    });
  });
  response.json("");
});

router.post("/:id/discardFromHand", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");

  db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
    userId,
    roomId
  ]).then(results => {
    let playerId = results["player_id"];

    (async function() {
      hand = await serverSide.getHand(playerId, roomId);
      let cardId = hand[request.body["cardNum"]];

      await serverSide.removeCard(playerId, roomId, cardId);

      let topDiscard = await serverSide.getTopDiscard(roomId);
      // console.log(topDiscard);

      io.to(roomId).emit("discard", topDiscard);
      hand = await serverSide.getHand(playerId, roomId);
      io.to(userId + roomId).emit("draw", hand);

      //calculate any melds
      let meldData = await serverSide.getMeldData(playerId, roomId);

      io.to(userId + roomId).emit("displayMelds", meldData);
    })();
  });
  response.json("");
  // console.log(request.body["cardNum"]);
});

router.post("/:id/drawFromDiscard", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");
  let hand = [];

  db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
    userId,
    roomId
  ]).then(results => {
    (async function() {
      let playerId = results["player_id"];
      await serverSide.drawFromDiscard(playerId, roomId);

      let topDiscard = await serverSide.getTopDiscard(roomId);

      io.to(roomId).emit("discard", topDiscard);

      hand = await serverSide.getHand(playerId, roomId);
      //console.log(hand);
      io.to(userId + roomId).emit("draw", hand);
      // calculate any melds
      let meldData = await serverSide.getMeldData(playerId, roomId);

      io.to(userId + roomId).emit("displayMelds", meldData);
    })();
  });
  response.json("");
  // console.log(hand);
});

router.post("/:id/draw", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");
  let hand = [];

  db.one("SELECT * FROM players WHERE user_id = $1 AND room_id = $2", [
    userId,
    roomId
  ]).then(results => {
    (async function() {
      let playerId = results["player_id"];
      await serverSide.drawFromDeck(playerId, roomId);

      hand = await serverSide.getHand(playerId, roomId);
      // console.log(hand);
      io.to(userId + roomId).emit("draw", hand);

      //melds and shit

      let meldData = await serverSide.getMeldData(playerId, roomId);

      io.to(userId + roomId).emit("displayMelds", meldData);
    })();
  });
  response.json("");
});

router.post("/:id/deal", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let io = request.app.get("io");

  //deal to both players (WILL ONLY WORK ONCE BOTH CONNECT, DONT TRY THIS WITHOUT )
  db.one("SELECT * FROM rooms WHERE room_id = $1", [roomId])
    .then(results => {
      let guestId = results["guest_id"];
      let hostId = results["host_id"];

      let guestUserId = "";
      let hostUserId = "";
      //deal to the guest
      db.one("SELECT * FROM players WHERE player_id = $1 AND room_id = $2", [
        guestId,
        roomId
      ])
        .then(results => {
          guestUserId = results["user_id"];
        })
        .then(_ => {
          db.one(
            "SELECT * FROM players WHERE player_id = $1 AND room_id = $2",
            [hostId, roomId]
          )
            .then(results => {
              hostUserId = results["user_id"];

              let somebody;

              (async function() {
                somebody = await serverSide.deal10Cards(hostId, roomId); //todo NOTE, somebody will contain array of 10 cards
                // console.log("THIS IS HAND " + somebody);

                //response.send(somebody);
                // console.log("games socket room " + userId + roomId);
                // console.log("sending a hand to a host");
                io.to(hostUserId + roomId).emit("deal", somebody);

                somebody = await serverSide.deal10Cards(guestId, roomId); //todo NOTE, somebody will contain array of 10 cards
                // console.log("THIS IS HAND " + somebody);
                //response.send(somebody);
                // console.log("games socket room " + userId + roomId);
                // console.log("sending a hand to a guest");
                io.to(guestUserId + roomId).emit("deal", somebody);

                //after the cards are drawn discard one
                await serverSide.deckToDiscard(roomId);

                //test to look
                let deckDiscard = await serverSide.getTopDiscard(roomId);

                io.to(roomId).emit("discard", deckDiscard);

                //calculate any melds
                let meldData = await serverSide.getMeldData(playerId, roomId);

                io.to(userId + roomId).emit("displayMelds", meldData);
              })();
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(error => {
          console.log(error);
        });

      //deal to the host
    })
    .catch(error => {
      console.log(error);
    });
  response.json("");
});

router.get("/:id/getHost", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let guestOrHost = "";

  //with the room id, find the guest and host player id
  db.one(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]).then(results => {
    let hostId = results["host_id"];

    db.one("SELECT * FROM players WHERE player_id = $1", [hostId]).then(
      results => {
        //get the users id
        let hostUserId = results["user_id"];
        if (userId == hostUserId) {
          guestOrHost = "host";
        } else {
          guestOrHost = "guest";
        }

        db.one(`SELECT * FROM users WHERE id = $1`, [hostUserId])
          .then(results => {
            results["hostId"] = hostId;
            results["userId"] = userId;
            results["guestOrHost"] = guestOrHost;
            //now that you have the username send it out with response
            response.json(results);
          })
          .catch(error => console.log(error));
      }
    );
  });
});

//get the hostname to render on page
router.get("/:id/getGuest", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;
  let guestOrHost = "";

  //with the room id, find the guest and host player id
  db.one(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]).then(results => {
    let guestId = results["guest_id"];
    db.one("SELECT * FROM players WHERE player_id = $1", [guestId])
      .then(results => {
        //get the users id

        //check if the user currently connected is a guest, used to establish a socket emission
        let guestUserId = results["user_id"];

        // if (guestUserId == userId) {
        //   guestOrHost = "guest";
        // } else {
        //   guestOrHost = "host";
        // }

        // console.log(guestOrHost);

        db.one(`SELECT * FROM users WHERE id = $1`, [guestUserId])
          .then(results => {
            //now that you have the username send it out with response
            // results["guestOrHost"] = guestOrHost;
            response.json(results);
          })
          .catch(error => console.log(error));
      })
      .catch(error => {
        //no guest in the game so just throw back waiting for guest
        response.json("waiting for guest");
      });
  });
});

router.get("/:id/getTopDiscard", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;

  (async function() {
    let topDiscard = await serverSide.getTopDiscard(roomId);
    // console.log("get top discard says");
    // console.log(topDiscard);
    return response.json(topDiscard);
  })();
});

router.get("/:id/getHand", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;

  //check if the game room has a guest and host in it first

  db.one("SELECT * FROM players WHERE room_id = $1 AND user_id = $2", [
    roomId,
    userId
  ])
    .then(results => {
      // console.log(results);
      let playerId = results["player_id"];

      (async function() {
        let hand = await serverSide.getHand(playerId, roomId);
        // console.log("get hand says");
        // console.log(hand);
        return response.json(hand);
      })();
    })
    .catch(error => {
      console.log(error);
    });
});

function isGuestOrHost(userId, roomId) {
  db.one(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]).then(results => {
    let hostId = results["host_id"];

    db.one("SELECT * FROM players WHERE player_id = $1", [hostId]).then(
      results => {
        //get the users id
        let hostUserId = results["user_id"];
        if (userId == hostUserId) {
          // guestOrHost = "host";
          return "host";
        } else {
          // guestOrHost = "guest";
          return "guest";
        }
      }
    );
  });
}

function joinGame(userId, roomId, io, response) {
  db.any("SELECT * FROM players WHERE room_id = $1", roomId).then(results => {
    //check the player(s) in the results and see if the given userid trying to join is either of them

    //if theirs no players at all then add the user as a host, and add their player id as a guest_id to the room
    if (results.length == 0) {
      db.none(
        `INSERT INTO players (user_id,room_id) VALUES ('${userId}','${roomId}')`
      )
        .then(_ => {
          //grab the player_id that was just generated
          db.any(`SELECT * FROM players WHERE user_id = $1 AND room_id = $2`, [
            userId,
            roomId
          ]).then(results => {
            //send the player to the socket room for the host for that game room
            //io.emit("hostJoin", { userId: userId, roomId: roomId });

            //add that playerid as the hostid
            db.none(
              `UPDATE rooms SET host_id = ${results[0]["player_id"]} WHERE room_id = $1`,
              [roomId]
            ).catch(error => {
              console.log(error);
            });
          });
        })
        .then(_ => {
          response.render("game");
        });
    }
    //if theirs a host already in there, then check if theyre the host
    else if (results.length <= 2) {
      //if theyre not the host then add them as a guest
      //if they are the host then just let them back in and dont do anything

      //get the player id of the user in the game currently
      console.log(results);
      //check if the playerId is owned by the same user that is trying to join the lobby
      //if it is owned by the same user, they are the host and just let them in
      //if it is not the same user, then add the user as a new player to the game, then insert them as the guest_id in the rooms table

      db.one(`SELECT * FROM players WHERE user_id = $1 AND room_id = $2`, [
        userId,
        roomId
      ])
        .then(results => {
          let playerInRoomId = results["player_id"];

          db.any(
            `SELECT * FROM players WHERE player_id = $1 AND user_id = $2`,
            [playerInRoomId, userId]
          )
            .then(results => {
              //if this returns a result, that means that the player in the room is owned by this user, so just let them into the game
              if (results.length > 0) {
                //the user joining is the hosst

                response.render("game");
              } else {
              }
            })
            .catch(error => {
              console.log(error);
            });
        })
        .catch(_ => {
          //the user joining is a guest

          //if theyre a guest and joining, then make a player for them, and add that players id to the guest_id slot for the room
          db.none(
            `INSERT INTO players (user_id,room_id) VALUES ('${userId}','${roomId}')`
          )
            .then(_ => {
              //grab the player_id that was just generated
              db.any(
                `SELECT * FROM players WHERE user_id = $1 AND room_id = $2`,
                [userId, roomId]
              ).then(results => {
                //add that playerid as the hostid
                db.none(
                  `UPDATE rooms SET guest_id = ${results[0]["player_id"]} WHERE room_id = $1`,
                  [roomId]
                )
                  .then(_ => {
                    //right here is where the game can start actually,
                    // console.log("the game is afoot");
                    //
                  })
                  .catch(error => {
                    console.log(error);
                  });
              });
            })
            .then(response.render("game"));
        });
    }
    //boot them back to the lobby
    else {
      // console.log(results);
      //check if either user should be in the game

      //patch fix re-look over logic later

      console.log("game full");
      response.redirect("/lobby");
    }
  });
}

module.exports = router;
