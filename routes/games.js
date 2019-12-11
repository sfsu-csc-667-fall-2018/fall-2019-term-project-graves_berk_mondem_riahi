const express = require("express");
const router = express.Router();
const isLoggedIn = require("../auth/middleware/isLoggedIn");
const db = require("./db/connection");

/* GET home page. */

router.get("/:id", isLoggedIn, function(request, response) {
  //id is just whatever it parses after /game_
  //params stores the id after game_
  //if we can get these we're golden
  const roomId = request.params["id"];
  const userId = request.user.id;

  //check if the user is supposed to be in the lobby, or if it has two users already
  db.one("SELECT * FROM rooms WHERE room_id = $1", request.params["id"])
    .then(_ => {
      console.log(userId + " joined " + roomId);
      response.render("game");
    })
    .catch(error => {
      response.render("lobby");
    });
});

//drawing a card from the deck
//   // //psuedo code
// room.post("/drawCard", function(request,response){

//   // //gets you the socket info so you can emit stuff to the frontend
//   // let io = request.app.get("io");
//   // //orderNumber keeps track of the shuffled db
//   // //something like this
//   // let cardDrawn;
//   // db.one("SELECT * FROM deck MIN(deck.order_num)" ).then(card => {
//   //   cardDrawn = card.card_id
//   //   //add that card_id to the hand table
//   //   //remove the card_id from the deck table

//   // })

//   // //all the db bullshit is done
//   // //socket emmision
//   // io.to('namespace').emit(
//   //   "draw card",
//   //   request.body.roomName,
//   //   request.body.roomId
//   //   // request.body.roomPassword
//   // );

// })

module.exports = router;
