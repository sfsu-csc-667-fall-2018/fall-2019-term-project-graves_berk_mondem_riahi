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
      response.redirect("/lobby");
    });
});

router.get("/:id/getHost", isLoggedIn, function(request, response) {
  const roomId = request.params["id"];
  const userId = request.user.id;

  //with the room id, find the guest and host player id
  db.one(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]).then(results => {
    let hostId = results["host_id"];
    db.one("SELECT * FROM players WHERE player_id = $1", [hostId]).then(
      results => {
        //get the users id
        let hostUserId = results["user_id"];
        db.one(`SELECT * FROM users WHERE id = $1`, [hostUserId])
          .then(results => {
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

  //with the room id, find the guest and host player id
  db.one(`SELECT * FROM rooms WHERE room_id = $1`, [roomId]).then(results => {
    let guestId = results["guest_id"];
    db.one("SELECT * FROM players WHERE player_id = $1", [guestId])
      .then(results => {
        //get the users id
        let guestUserId = results["user_id"];
        db.one(`SELECT * FROM users WHERE id = $1`, [guestUserId])
          .then(results => {
            //now that you have the username send it out with response
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

function joinGame(userId, roomId, response) {
  db.any("SELECT * FROM players WHERE room_id = $1", roomId).then(results => {
    //check the player(s) in the results and see if the given userid trying to join is either of them
    let foundPlayer = false;
    for (let i = 0; i < results.length; i++) {
      if ([results[i]["user_id"]] == userId) {
        foundPlayer = true;
      }
    }
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

      //get the player id of the user in the game currently

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
              db.any(`SELECT * FROM players WHERE user_id = $1`, [userId]).then(
                results => {
                  //add that playerid as the hostid
                  db.none(
                    `UPDATE rooms SET guest_id = ${results[0]["player_id"]} WHERE room_id = $1`,
                    [roomId]
                  ).catch(error => {
                    console.log(error);
                  });
                }
              );
            })
            .then(response.render("game"));
        });
    }
    //boot them back to the lobby
    else {
      response.redirect("/lobby");
    }
  });
}

module.exports = router;
