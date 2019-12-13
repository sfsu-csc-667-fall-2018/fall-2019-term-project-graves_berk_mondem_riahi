const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");
// const deck = require("../gameLogic/deck");

/* GET home page. */
router.get("/:id", isLoggedIn, function(request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  //if we can get these we're golden
  const roomId = request.params["id"];
  const userId = request.user.id;

  //check if the user is supposed to be in the lobby, or if it has two users already
  db.one("SELECT * FROM rooms WHERE room_id = $1", roomId)
    .then(_ => {
      console.log(userId + " joined " + roomId);
      //add the user to the game
      joinGame(userId, roomId, response);
    })
    .catch(error => {
      //if the game room doesnt exist just send them back to the lobby
      console.log(error);
      console.log("no rooms");
      response.redirect("/lobby");
    });
});

function joinGame(userId, roomId, response) {
  db.any("SELECT * FROM players WHERE room_id = $1", roomId).then(results => {
    //check the player(s) in the results and see if the given userid trying to join is either of them
    let foundPlayer = false;
    for (let i = 0; i < results.length; i++) {
      if ([results[i]["user_id"]] == userId) {
        foundPlayer = true;
      }
    }

    console.log(results);
    //if theirs no players at all then add the user as a host, and add their player id as a guest_id to the room
    if (results.length == 0) {
      db.none(
        `INSERT INTO players (user_id,room_id) VALUES ('${userId}','${roomId}')`
      )
        .then(_ => {
          //grab the player_id that was just generated
          db.any(`SELECT * FROM players WHERE user_id = $1`, [userId]).then(
            results => {
              //add that playerid as the hostid
              db.none(
                `UPDATE rooms SET host_id = ${results[0]["player_id"]} WHERE room_id = $1`,
                [roomId]
              ).catch(error => {
                console.log(error);
              });
            }
          );
        })
        .then(response.render("game"));
    }
    //if theirs a host already in there, then check if theyre the host
    else if (results.length == 1) {
      //if theyre not the host then add them as a guest
      //if they are the host then just let them back in and dont do anything
      response.render("game");
      console.log("should be a guest");
    }
    //boot them back to the lobby
    else {
      console.log("game full");
      response.redirect("/lobby");
    }

    //rendering

    //add the user to the players table

    // db.none(
    //   `INSERT INTO players (user_id,room_id) VALUES ('${userId}','${roomId}')`
    // ).then(_ => {
    //   //get the player id and then store that player id into the rooms table as a guest or host
    //   db.any(`SELECT * from players WHERE user_id = $1 AND room_id = $2`, [
    //     userId,
    //     roomId
    //   ])
    //     .then(results => {
    //       // console.log("i think this player is in this game");
    //       // console.log(results);

    //       db.none(
    //         `UPDATE rooms SET ${guestOrHost} = ${results[guestOrHostPos]["player_id"]} WHERE room_id = $1`,
    //         [roomId]
    //       ).catch(error => console.log(error));
    //     })
    //     .catch(error => console.log(error));
    // });

    //   response.render("game");
    // } else if (foundPlayer) {
    //   response.render("game");
    // } else {
    //   response.redirect("/lobby");
    // }

    //rooms stuff
  });

  // .catch(error => {
  //   //no players for that room
  //   //get the user id who made the server and add them as a player for that room
  //   //send them to the game
  //   response.redirect("/lobby");
  // });
}

// drawing a card from the deck
// //psuedo code
// room.post("/:id/drawCard", function(request, response) {
//   //gets you the socket info so you can emit stuff to the frontend
//   let io = request.app.get("io");
//   //orderNumber keeps track of the shuffled db
//   //something like this
//   let cardDrawn;
//   db.one("SELECT * FROM deck MIN(deck.order_num) WHERE deck.room_id = " + roomId, [true]).then(card => {
//     cardDrawn = card.card_id;
//     //add that card_id to the hand table
//     //remove the card_id from the deck table
//   });

//   //all the db bullshit is done
//   //socket emmision
//   io.to("namespace").emit(
//     "draw card",
//     request.body.roomName,
//     request.body.roomId
//     // request.body.roomPassword
//   );
// });

module.exports = router;
