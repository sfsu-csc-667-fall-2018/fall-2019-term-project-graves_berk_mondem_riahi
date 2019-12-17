const db = require("../routes/db/connection");
const sortArray = require("array-sort"); //needed so can sort array in generateRandomDeck.

async function getHand(playerId, roomId) {
  let holder = [];

  await db
    .any(
      "SELECT card_id FROM handcards WHERE player_id = $1 AND room_id = $2",
      [playerId, roomId]
    )
    .then(results => {
      for (let index = 0; index < results.length; index++) {
        holder.push(results[index]["card_id"]);
      }
    });

  //console.log("111 IN getHand  " + holder);
  holder = sorted(holder);
  ///console.log("222 IN getHand  " + holder);
  return holder;
}

async function getTopDiscard(roomId) {
  let cardId;

  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      let results = await t.one(
        "SELECT * FROM discards WHERE discard_id = (SELECT MAX(discard_id) FROM discards WHERE room_id = $1)",
        roomId
      );
      cardId = results["card_id"];
    })
    .catch(error => {
      console.log("Error in drawFromDiscard " + error);
    });

  return cardId;
}

async function checkDiscard(roomId) {
  let cardId;

  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      let results = await t.one(
        "SELECT * FROM discards WHERE discard_id = (SELECT MAX(discard_id) FROM discards WHERE room_id = $1)",
        roomId
      );
      cardId = results["card_id"];
    })
    .catch(error => {
      console.log("Error in drawFromDiscard " + error);
    });

  if (cardId != undefined) {
    return true;
  }

  return false;
}

async function getMeldData(playerId, roomId) {
  let playerHand = await getHand(playerId, roomId);
  ///console.log("IN getMeldData  " + playerHand);

  let meldData = formMelds(playerHand);

  ///console.log("we finished calculating melds");
  return meldData; //not returning playerHand in this method, need to call getHand for that.
}

async function drawFromDeck(playerId, roomId) {
  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      let results = await t.one(
        "SELECT * FROM decks WHERE deck_id = (SELECT MIN(deck_id) FROM decks WHERE room_id = $1)",
        roomId
      );
      let deckId = results["deck_id"];
      let cardId = results["card_id"];

      await t.none(
        "INSERT INTO handcards(player_id,room_id,card_id) VALUES($1, $2, $3)",
        [playerId, roomId, cardId]
      );

      return await t.result("DELETE FROM decks WHERE deck_id = $1", deckId);
    })
    .catch(error => {
      console.log("Error in drawFromDeck " + error);
    });
}

async function drawFromDiscard(playerId, roomId) {
  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      let results = await t.one(
        "SELECT * FROM discards WHERE discard_id = (SELECT MAX(discard_id) FROM discards WHERE room_id = $1)",
        roomId
      );
      let discardId = results["discard_id"];
      let cardId = results["card_id"];

      await t.none(
        "INSERT INTO handcards(player_id,room_id,card_id) VALUES($1, $2, $3)",
        [playerId, roomId, cardId]
      );

      return await t.result(
        "DELETE FROM discards WHERE discard_id = $1",
        discardId
      );
    })
    .catch(error => {
      console.log("Error in drawFromDiscard " + error);
    });
}

async function removeCard(playerId, roomId, cardId) {
  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      await t.result(
        "DELETE FROM handcards WHERE player_id = $1 AND room_id = $2 AND card_id = $3",
        [playerId, roomId, cardId]
      );

      await t.none("INSERT INTO discards(room_id,card_id) VALUES($1, $2)", [
        roomId,
        cardId
      ]);
    })
    .catch(error => {
      console.log("Error in removeCard " + error);
    });
}

async function deal10Cards(playerId, roomId) {
  let holder = [];

  for (let index = 0; index < 10; index++) {
    await db
      .tx(async t => {
        //seems this code will run async to rest of code in this method.
        let results = await t.one(
          "SELECT * FROM decks WHERE deck_id = (SELECT MIN(deck_id) FROM decks WHERE room_id = $1)",
          roomId
        );

        let deckId = results["deck_id"];
        let cardId = results["card_id"];

        await t.none(
          "INSERT INTO handcards(player_id,room_id,card_id) VALUES($1, $2, $3)",
          [playerId, roomId, cardId]
        );
        holder.push(cardId);
        return await t.result("DELETE FROM decks WHERE deck_id = $1", deckId);
        //have to return a value
      })
      .catch(error => {
        console.log("Error in deal10Cards " + error);
      });
  }

  holder = sorted(holder);
  return holder;
}

async function deckToDiscard(roomId) {
  await db
    .tx(async t => {
      //seems this code will run async to rest of code in this method.
      let results = await t.one(
        "SELECT * FROM decks WHERE deck_id = (SELECT MIN(deck_id) FROM decks WHERE room_id = $1)",
        roomId
      );

      let deckId = results["deck_id"];
      let cardId = results["card_id"];

      await t.none("INSERT INTO discards(room_id,card_id) VALUES($1, $2)", [
        roomId,
        cardId
      ]);

      return await t.result("DELETE FROM decks WHERE deck_id = $1", deckId);
      //have to return a value
    })
    .catch(error => {
      console.log("Error in deckToDiscard " + error);
    });
}

async function deleteRoom(roomId) {
  await db.tx(async t => {
    let deckCardsDeleted = await t.result(
      "DELETE FROM decks WHERE room_id = $1",
      roomId
    );
    console.log("Number of deck cards deleted " + deckCardsDeleted.rowCount);
    let discardCardsDeleted = await t.result(
      "DELETE FROM discards WHERE room_id = $1",
      roomId
    );
    console.log(
      "Number of discard cards deleted " + discardCardsDeleted.rowCount
    );
    let playerHandCardsDeleted = await t.result(
      "DELETE FROM handcards WHERE room_id = $1",
      roomId
    ); //would delete both players hand.
    console.log(
      "Number of hand cards deleted " + playerHandCardsDeleted.rowCount
    );

    //todo going to assume don't need to change playerId in rooms for now, though would just be two different sql statements

    let playersDeleted = await t.result(
      "DELETE FROM players WHERE room_id = $1",
      roomId
    ); //should delete two if both players are in.
    console.log("Number of players deleted " + playersDeleted.rowCount);
    let roomsDeleted = await t.result(
      "DELETE FROM rooms WHERE room_id = $1",
      roomId
    );
    console.log(
      "Number of rooms deleted is  " +
        roomsDeleted.rowCount +
        " . It should be 1"
    );

    //since we dropped individual chatrooms for each room so can focus more on game, don't need this.
    //let messagesDeleted = await t.result("DELETE FROM messages WHERE room_id = $1", roomId);
    //console.log("Number of messages deleted is " + messagesDeleted.rowCount);
  });
}

//todo note, actionPerformed will be value  knock,gin,  big gin.
//  will also send back score, not going to implement displaying new runs
async function doLayOffsAndScore(
  player1Id,
  player2Id,
  buttonPresserId,
  roomId,
  actionPerformed
) {
  let player1MeldData = await getMeldData(player1Id, roomId);
  let player2MeldData = await getMeldData(player2Id, roomId);

  //determines whether the player who press an action button can actually perform action.
  if (player1Id == buttonPresserId) {
    if (actionPerformed.localeCompare("knock")) {
      if (!player1MeldData.canKnock) {
        console.log("Player " + buttonPresserId + " not allowed to knock");
        return;
      }
    } else if (actionPerformed.localeCompare("gin")) {
      if (!player1MeldData.canGin) {
        console.log("Player " + buttonPresserId + "  not allowed to gin");
      }
    } else if (!actionPerformed.localeCompare("big gin")) {
      if (!player1MeldData.canBigGin) {
        console.log("Player " + buttonPresserId + "  not allowed to big gin");
      }
    }
  } else if (player2Id == buttonPresserId) {
    if (actionPerformed.localeCompare("knock")) {
      if (!player2MeldData.canKnock) {
        console.log("Player " + buttonPresserId + " not allowed to knock");
        return;
      }
    } else if (actionPerformed.localeCompare("gin")) {
      if (!player2MeldData.canGin) {
        console.log("Player " + buttonPresserId + "  not allowed to gin");
      }
    } else if (!actionPerformed.localeCompare("big gin")) {
      if (!player2MeldData.canBigGin) {
        console.log("Player " + buttonPresserId + "  not allowed to big gin");
      }
    }
  } else {
    console.log("Error in doLayOffsAndScore");
    console.log(
      "Player1 " +
        player1Id +
        "  Player2  " +
        player2Id +
        "   button presser  " +
        buttonPresserId
    );
    return;
  }

  //now since we determine if button presser can perform action, now time to do possible layoffs and handling score.
  let totalScore = 0;
  let buttonPresserWon = true;
  if (actionPerformed.localeCompare("gin")) {
    let cumulativeDeadwood = Math.abs(
      player1MeldData.deadwoodValue - player2MeldData.deadwoodValue
    );
    totalScore += scoring(cumulativeDeadwood, false, true, false, false);
  } else if (actionPerformed.localeCompare("big gin")) {
    let cumulativeDeadwood = Math.abs(
      player1MeldData.deadwoodValue - player2MeldData.deadwoodValue
    );
    totalScore += scoring(cumulativeDeadwood, false, false, true, false);
  } else if (actionPerformed.localeCompare("knock")) {
    //todo note, this is where winner could not be the one who pressed button.

    if (player1Id == buttonPresserId) {
      //player 1 knocked
      let player2Deadwood = player2MeldData.deadwood.slice(0);
      let player1Runs = player1MeldData.runs.slice(0);
      let player1Sets = player1MeldData.sets.slice(0);

      deadWoodToRuns(player2Deadwood, player1Runs);
      deadWoodToSets(player2Deadwood, player1Sets);

      let cumulativeDeadwood =
        deadWoodCalculator(player2Deadwood) - player1MeldData.deadwoodValue;

      if (cumulativeDeadwood <= 0) {
        //undercut happened.
        buttonPresserWon = false;
        totalScore += scoring(cumulativeDeadwood, true, false, false, true);
      } else {
        totalScore += scoring(cumulativeDeadwood, true, false, false, false);
      }
    } else {
      //player 2 knocked
      let player1Deadwood = player1MeldData.deadwood.slice(0);
      let player2Runs = player2MeldData.runs.slice(0);
      let player2Sets = player2MeldData.sets.slice(0);

      deadWoodToRuns(player1Deadwood, player2Runs);
      deadWoodToSets(player1Deadwood, player2Sets);

      let cumulativeDeadwood =
        deadWoodCalculator(player1Deadwood) - player2MeldData.deadwoodValue;

      if (cumulativeDeadwood <= 0) {
        //undercut happened.
        buttonPresserWon = false;
        totalScore += scoring(cumulativeDeadwood, true, false, false, true);
      } else {
        totalScore += scoring(cumulativeDeadwood, true, false, false, false);
      }
    }
  }

  let loserScore = 0;
  let winnerScore = 0;

  if (buttonPresserWon) {
    await db.tx(async t => {
      winnerScore = await t.one(
        "SELECT points FROM players WHERE player_id = $1",
        buttonPresserId
      );
      winnerScore = winnerScore["points"];
      winnerScore += totalScore;
      await t.none("UPDATE players SET points = $1 WHERE player_id = $2", [
        winnerScore,
        buttonPresserId
      ]); //todo IT IS UPDATING WINNERS SCORE.

      if (player1Id != buttonPresserId) {
        loserScore = await t.one(
          "SELECT points FROM players WHERE player_id = $1",
          player1Id
        );
      } else {
        loserScore = await t.one(
          "SELECT points FROM players WHERE player_id = $1",
          player2Id
        );
      }
    });
    console.log("score data asdasd");
    let scoreData;
    if (player1Id != buttonPresserId) {
      //player 1 is the loser since button presser won.
      scoreData = {
        player1score: loserScore["points"],
        player2score: winnerScore,
        winnerId: player2Id
      };
    } else {
      //player 1 is the winner
      scoreData = {
        player1score: winnerScore,
        player2score: loserScore["points"],
        winnerId: player1Id
      };
    }

    console.log("score data");
    console.log(scoreData);
    return scoreData;
  } else {
    //a undercut happened so button presser isn't the winner

    let winnerId;
    if (player1Id != buttonPresserId) {
      winnerId = player1Id;
    } else {
      winnerId = player2Id;
    }

    await db.tx(async t => {
      winnerScore = await t.one(
        "SELECT points FROM players WHERE player_id = $1",
        winnerId
      );
      winnerScore = winnerScore["points"];
      winnerScore += totalScore;
      await t.none("UPDATE players SET points = $1 WHERE player_id = $2", [
        winnerScore,
        winnerId
      ]); //todo IT IS UPDATING WINNERS SCORE.

      if (player1Id != winnerId) {
        loserScore = await t.one(
          "SELECT points FROM players WHERE player_id = $1",
          player1Id
        );
      } else {
        loserScore = await t.one(
          "SELECT points FROM players WHERE player_id = $1",
          player2Id
        );
      }
    });
    console.log("score data asdasd");
    let scoreData;
    if (player1Id != winnerId) {
      //player 1 is the loser since button presser won.
      scoreData = {
        player1score: loserScore["points"],
        player2score: winnerScore,
        winnerId: player2Id
      };
    } else {
      //player 1 is the winner
      scoreData = {
        player1score: winnerScore,
        player2score: loserScore["points"],
        winnerId: player1Id
      };
    }
    console.log(scoreData);
    return scoreData;
  }
}

//TODO above methods involves communication with client and database

//for determining the score based on action and the deadwood value between the two players.
function scoring(totalDeadwood, knocker, ginner, bigGin, undercut) {
  if (knocker) {
    if (undercut) {
      return 25 + totalDeadwood;
    }
    return totalDeadwood;
  } else if (ginner) {
    return 25 + totalDeadwood;
  } else if (bigGin) {
    return 31 + totalDeadwood;
  }
}

function sorted(listToSort) {
  let newlySorted = sortArray(listToSort, function(a, b) {
    if ((a % 13) - (b % 13) === 0) {
      //same face value but different suite
      return a - b;
    } else {
      return (a % 13) - (b % 13);
    }
  });

  return newlySorted;
}

function formMelds(theHand) {
  let sets = []; //exist here so other player can get them after meld creation during scoring
  let runs = []; //exist here so other player can get them after meld creation during scoring
  let deadwoodList = []; //exist here so other player can get them after meld creation during scoring
  let smallestDeadwoodValue = 7331; //exist here so other player can get them after meld creation during scoring
  // ALSO exist for meld recursion
  let deadWoodCardCount = 1337; //exist here so other player can get them after meld creation during scoring
  // ALSO exist for meld recursion

  let sizeOfHand = theHand.length;

  console.log("STARTING meld calculations");

  meldRecursion(theHand.slice(0), [], [], []);

  function meldRecursion(changedHand, theRuns, theSets, skippedCards) {
    let tempHand = changedHand.slice(0);
    let tempRuns = theRuns.slice(0);
    let tempSets = theSets.slice(0);
    let need4SetAction = false;
    let did4RunAction = false;
    let doOtherRunActions = [false, false];
    let ignoreCards = skippedCards.slice(0); //this is used so don't re-pick conflict cards that chose skip action higher up in tree.
    let conflictCardID = -1;

    if (tempHand.length < 3) {
      updateMeldsCheck(tempHand, tempRuns, tempSets);
      return;
    }

    //begin cleaning
    cleaningSets(tempHand, tempSets);
    cleaningRuns(tempHand, tempRuns);

    if (tempHand.length < 3) {
      updateMeldsCheck(tempHand, tempRuns, tempSets);
      return;
    }

    tempHand = sorted(tempHand);

    //Have to search for conflict card. Going from right to left (higher value to lower)
    for (let index = tempHand.length - 1; index > -1; index--) {
      let cardValue = tempHand[index];
      if (ignoreCards.includes(cardValue)) {
        //this card chose skip action in this tree path so not making it a conflict card again.
        continue;
      }
      if (isInRun(tempHand, cardValue) && isInSet(tempHand, cardValue)) {
        conflictCardID = cardValue;
        break;
      }
    }
    if (conflictCardID == -1) {
      //no more conflict cards that are not in ignoreCards.
      updateMeldsCheck(tempHand, tempRuns, tempSets);
      return;
    }

    {
      let handForDoBySet = tempHand.slice(0);
      let setsForDoBySet = tempSets.slice(0);
      need4SetAction = doBySet(handForDoBySet, setsForDoBySet, conflictCardID);
      meldRecursion(handForDoBySet, tempRuns, setsForDoBySet, ignoreCards);
    }

    {
      let handForRun3 = tempHand.slice(0);
      let runsForRun3 = tempRuns.slice(0);
      doOtherRunActions = makeRun(handForRun3, runsForRun3, conflictCardID, 3);
      meldRecursion(handForRun3, runsForRun3, tempSets, ignoreCards);
    }

    if (need4SetAction) {
      let handForDo4Set = tempHand.slice(0);
      let setsForDo4Set = tempSets.slice(0);
      do4Set(handForDo4Set, setsForDo4Set, conflictCardID);
      meldRecursion(handForDo4Set, tempRuns, setsForDo4Set, ignoreCards);
    }

    if (doOtherRunActions[0]) {
      //determines if need to do 4 run
      let handFor4Run = tempHand.slice(0);
      let runsFor4Run = tempRuns.slice(0);
      doOtherRunActions = makeRun(handFor4Run, runsFor4Run, conflictCardID, 4);
      did4RunAction = true;
      meldRecursion(handFor4Run, runsFor4Run, tempSets, ignoreCards);
    }
    // if 4 run action happened, need to look at index 0 to determine if need 5 run, otherwise need to look at 1.
    if (
      (doOtherRunActions[1] && !did4RunAction) ||
      (doOtherRunActions && doOtherRunActions[1])
    ) {
      let handFor5Run = tempHand.slice(0);
      let runsFor5Run = tempRuns.slice(0);
      makeRun(handFor5Run, runsFor5Run, conflictCardID, 5);
      meldRecursion(handFor5Run, runsFor5Run, tempSets, ignoreCards);
    }

    //skip action. Helpful for grabbing all possible set combinations
    ignoreCards.push(conflictCardID);
    meldRecursion(tempHand, tempRuns, tempSets, ignoreCards);
  }

  function updateMeldsCheck(tempHand, tempRuns, tempSets) {
    let updatedTempRuns = deadWoodToRuns(tempHand, tempRuns);
    //  it will have new values in it. Don't need it for sets since can modify array that was passed in.
    deadWoodToSets(tempHand, tempSets); //don't sort in here
    let deadWoodCount = deadWoodCalculator(tempHand);
    //all remaining cards in tempHand are deadwood.
    if (deadWoodCount < smallestDeadwoodValue) {
      let sortedTempRuns = sortArray(updatedTempRuns, function(a, b) {
        return a - b;
      });

      tempSets = sorted(tempSets);
      tempHand = sorted(tempHand);

      runs = runsTo2D(sortedTempRuns).slice(0);
      sets = setsTo2D(tempSets).slice(0);
      smallestDeadwoodValue = deadWoodCount;
      deadwoodList = tempHand.slice(0);
      deadWoodCardCount = tempHand.length;
    } else if (
      deadWoodCount == smallestDeadwoodValue &&
      deadWoodCardCount > tempHand.length
    ) {
      ////equal deadwood value but new combination provides fewer deadwood cards. (easier to get rid of)
      let sortedTempRuns = sortArray(updatedTempRuns, function(a, b) {
        return a - b;
      });

      tempSets = sorted(tempSets);
      tempHand = sorted(tempHand);
      runs = runsTo2D(sortedTempRuns).slice(0);
      sets = setsTo2D(tempSets).slice(0);
      smallestDeadwoodValue = deadWoodCount;
      deadwoodList = tempHand.slice(0);
      deadWoodCardCount = tempHand.length;
    }
  }

  let canKnock = false;
  let canGin = false;
  let canBigGin = false;

  if (deadwoodList.length == 0 && sizeOfHand == 11) {
    canBigGin = true;
  } else if (deadwoodList.length == 0 && sizeOfHand == 10) {
    //todo for now not doing setup where server discards card for player when they hit
    // knock or gin button
    canGin = true;
  } else if (smallestDeadwoodValue <= 10 && sizeOfHand == 10) {
    //player needs to discard before
    canKnock = true;
  }

  let meldData = {
    runs: runs,
    sets: sets,
    deadwood: deadwoodList,
    deadwoodValue: smallestDeadwoodValue,
    canKnock: canKnock,
    canGin: canGin,
    canBigGin: canBigGin
  };

  return meldData;
}

function isInSet(changedHand, cardId) {
  let counter = 0;
  for (let value of changedHand) {
    if (value % 13 == cardId % 13) {
      counter++;
    }
    if (counter == 4) {
      break;
    }
  }
  if (counter > 2) {
    return true;
  } else if (counter > 4) {
    console.log("error in isInSet for " + changedHand + "  and " + cardId);
  }
  return false;
}

function isInRun(changedHand, cardId) {
  let reduceCardValue = cardId % 13;
  if (reduceCardValue >= 11) {
    //Queens and Kings
    if (reduceCardValue == 11) {
      //Queens
      if (
        changedHand.includes(cardId - 1) &&
        changedHand.includes(cardId + 1)
      ) {
        //card is middle of at LEAST 3 run
        return true;
      }
    }
    if (changedHand.includes(cardId - 1) && changedHand.includes(cardId - 2)) {
      // card is end of at LEAST 3 run
      return true;
    }
  } else if (reduceCardValue <= 1) {
    //Aces and Two's
    if (reduceCardValue == 1) {
      //Two's
      if (
        changedHand.includes(cardId - 1) &&
        changedHand.includes(cardId + 1)
      ) {
        //card is middle of at LEAST 3 run
        return true;
      }
    }
    if (changedHand.includes(cardId + 1) && changedHand.includes(cardId + 2)) {
      // card is at start of at LEAST 3 run
      return true;
    }
  } else {
    //3 - Jacks
    if (changedHand.includes(cardId - 1) && changedHand.includes(cardId + 1)) {
      //card is middle of at LEAST 3 run
      return true;
    } else if (
      changedHand.includes(cardId - 1) &&
      changedHand.includes(cardId - 2)
    ) {
      // card is end of at LEAST 3 run
      return true;
    } else if (
      changedHand.includes(cardId + 1) &&
      changedHand.includes(cardId + 2)
    ) {
      // card is at start of at LEAST 3 run
      return true;
    }
  }
  return false;
}

function deadWoodCalculator(theHand) {
  let counter = 0;
  for (let value of theHand) {
    if (value % 13 > 8) {
      //ten,jack,queen,king
      counter += 10;
    } else {
      counter += (value % 13) + 1;
    }
  }
  return counter;
}

function deadWoodToRuns(changedHand, runsTemp) {
  let currentRuns = sortArray(runsTemp, function(a, b) {
    return a - b;
  });
  let indexLeftCardOfRun = 0;
  let indexRightCardOfRun = -1;

  if (currentRuns.length == 0 || changedHand.length == 0) {
    return;
  }

  //since currentRuns is a 1D array with all found runs, need to find where one ends and another begins (or just ends).
  while (
    changedHand.length != 0 &&
    indexLeftCardOfRun < currentRuns.length &&
    indexRightCardOfRun < currentRuns.length
  ) {
    // used to find the end of run currently looking at.
    for (let index = indexLeftCardOfRun; index < currentRuns.length; index++) {
      if (index + 1 == currentRuns.length) {
        //at end of list
        indexRightCardOfRun = index;
        break;
      }
      if (
        currentRuns[index] + 1 == currentRuns[index + 1] &&
        sameSuite(currentRuns[index], currentRuns[index + 1])
      ) {
        continue;
      } else {
        indexRightCardOfRun = index; //index of last card in run currently looking at.
        break;
      }
    }

    if (indexRightCardOfRun < 2) {
      console.log("ERROR in deadWoodToRuns");
    }

    //now to check left side, have to loop
    while (true) {
      if (
        changedHand.includes(currentRuns[indexLeftCardOfRun] - 1) &&
        sameSuite(
          currentRuns[indexLeftCardOfRun],
          currentRuns[indexLeftCardOfRun] - 1
        )
      ) {
        //checks if card that fits left side of current run is in changedHand.
        let foundCard = currentRuns[indexLeftCardOfRun] - 1;
        currentRuns.splice(indexLeftCardOfRun, 0, foundCard);
        changedHand.splice(changedHand.indexOf(foundCard), 1);
        //leftCardOfRun would remain the value it started as since a new card is being put in that spot.
        //we do however need to update indexRightCardOfRun
        indexRightCardOfRun++;
      } else {
        break;
      }
    }
    if (changedHand.length <= 0) {
      break;
    }

    //now to check right side
    while (indexRightCardOfRun < currentRuns.length) {
      if (
        changedHand.includes(currentRuns[indexRightCardOfRun] + 1) &&
        sameSuite(
          currentRuns[indexRightCardOfRun],
          currentRuns[indexRightCardOfRun] + 1
        )
      ) {
        let foundCard = currentRuns[indexRightCardOfRun] + 1;
        if (indexRightCardOfRun + 1 == currentRuns.length) {
          //at end of currentRuns list
          currentRuns.push(foundCard);
        } else {
          currentRuns.splice(indexRightCardOfRun + 1, 0, foundCard);
        }
        changedHand.splice(changedHand.indexOf(foundCard), 1);
        indexRightCardOfRun++;
      } else {
        indexLeftCardOfRun = indexRightCardOfRun + 1;
        break;
      }
    }
  }
  return currentRuns;
}

//don't care for order since it will be sorted later. So I can modify original array passed in.
function deadWoodToSets(changedHand, setsTemp) {
  if (setsTemp.length == 0 || changedHand.length == 0) {
    return;
  }
  for (let index = 0; index < changedHand.length; index++) {
    let aCardValue = changedHand[index];
    if (
      setsTemp.includes(aCardValue - 13) ||
      setsTemp.includes(aCardValue + 13)
    ) {
      setsTemp.push(aCardValue);
      changedHand.splice(index, 1);
      index--;
    }
  }
}

//this RELIES ON theArray being sorted in my suite ordering format, or else it won't work. theArray has to be sorted before this method.
// When sending clients runs and sets, they will be in form of a 2D array, so need to convert 1D array been using during meld formations to a organized 2D
function setsTo2D(theArray) {
  let new2DArray = [[]];
  if (theArray.length == 0) {
    return new2DArray;
  }
  let setCount = 1;
  new2DArray[setCount - 1].push(theArray[0]); //grabbing first value of first set.
  for (let index = 1; index < theArray.length; index++) {
    if (new2DArray[setCount - 1][0] % 13 != theArray[index] % 13) {
      //at a new set
      setCount++;
      new2DArray.push([theArray[index]]);
    } else {
      new2DArray[setCount - 1].push(theArray[index]);
    }
  }
  return new2DArray;
}

//this RELIES ON theArray being sorted, or else it won't work. theArray must be sorted before this method.
// When sending clients runs and sets, they will be in form of a 2D array, so need to convert 1D array been using during meld formations to a organized 2D
function runsTo2D(theArray) {
  let new2DArray = [[]];
  if (theArray.length == 0) {
    return new2DArray;
  }
  let runCount = 1;
  new2DArray[runCount - 1].push(theArray[0]); //grabbing first value of first run.
  let indexOfCurRun = 0;
  for (let index = 1; index < theArray.length; index++) {
    if (
      new2DArray[runCount - 1][indexOfCurRun] + 1 != theArray[index] ||
      !sameSuite(new2DArray[runCount - 1][indexOfCurRun], theArray[index])
    ) {
      runCount++; //forming new run
      new2DArray.push([theArray[index]]);
      indexOfCurRun = 0;
    } else {
      new2DArray[runCount - 1].push(theArray[index]);
      indexOfCurRun++;
    }
  }
  return new2DArray;
}

// Creates a 3-4 size set with cardValue. If have a 4 set and 2+ conflict cards are in it,
// will reduce set size to 3 and return true representing need for 4 set action to occur.
function doBySet(changedHand, theSets, cardValue) {
  let holder = [];
  let need4SetAction = false;
  let canHave4Set = false;

  for (let value of changedHand) {
    if (value % 13 == cardValue % 13) {
      holder.push(value);
    }
    if (holder.length == 4) {
      canHave4Set = true;
      break;
    }
  }

  if (holder.length < 3) {
    console.log("Error in doBySet");
  }

  //Removes the conflict card that is to right of cardValue. A B C D all conflict cards, With A being cardvalue, would remove B. If D was cardValue, would remove A
  if (canHave4Set) {
    let cardValueIndex = holder.indexOf(cardValue);
    for (let index = cardValueIndex + 1; index % 4 != cardValueIndex; index++) {
      let value = holder[index % 4];
      if (isInRun(changedHand, value)) {
        need4SetAction = true;
        holder.splice(index % 4, 1);
        break;
      }
    }
    //NOTE, if there is only 1 conflict card in set (cardValue), will still have 4 set
  }

  for (let value of holder) {
    theSets.push(value);
    changedHand.splice(changedHand.indexOf(value), 1);
  }

  return need4SetAction;
}

//makes a set of 4 with cardValue
function do4Set(changedHand, theSets, cardValue) {
  let holder = [];

  for (let value of changedHand) {
    if (value % 13 == cardValue % 13) {
      holder.push(value);
    }
    if (holder.length == 4) {
      break;
    }
  }

  if (holder.length != 4) {
    console.log("ERROR in do4Set");
  }

  for (let value of holder) {
    theSets.push(value);
    changedHand.splice(changedHand.indexOf(value), 1);
  }
}

//Creates a minRunSize+ run with cardValue being part of the run. Will grab conflict cards in order to achieve minRunSize then only grab
//pure run cards. Need to guarantee a minRunSize is possible with cardValue in changedHand before call this method. Method returns whether
//minRunSize+1 and minRunSize+2 is possible and action is needed to make it (e.g. would need to grab a conflict card to make minRunSize+1 ).
// Will add formed run to passed in runsTemp list and remove cards used to make run from changedHand.
//cardValue is a conflict card.
function makeRun(changedHand, theRuns, cardValue, minRunSize) {
  let holder = [];
  let doOtherRuns = [false, false]; //determines if should do minRunSize+1 and minRunSize+2 action if available.
  let rightSearchCount = 1;
  let rightDeadEnd = false;
  let leftSearchCount = 1;
  let leftDeadEnd = false;
  holder.push(cardValue);

  //grab non-conflict cards on right that fit in current run and stop when hit conflict card OR
  // if the card value that would continue run on right isn't in changedHand.
  for (let count = rightSearchCount; count < changedHand.length; count++) {
    if (
      sameSuite(cardValue, cardValue + count) &&
      changedHand.includes(cardValue + count)
    ) {
      if (!isInSet(changedHand, cardValue + count)) {
        holder.push(cardValue + count);
      } else {
        // there exist a card that can continue run on right but its a conflict card.
        rightSearchCount = count;
        break;
      }
    } else {
      //no more cards on right that would fit current run.
      rightDeadEnd = true;
      break;
    }
  }

  //grab non-conflict cards on left that fit in current run and stop when hit conflict card OR
  // if the card value that would continue run on left isn't in changedHand.
  for (let count = leftSearchCount; count < changedHand.length; count++) {
    if (
      sameSuite(cardValue, cardValue - count) &&
      changedHand.includes(cardValue - count)
    ) {
      if (!isInSet(changedHand, cardValue - count)) {
        holder.push(cardValue - count);
      } else {
        // there exist a card that can continue run on left but its a conflict card.
        leftSearchCount = count;
        break;
      }
    } else {
      //no more cards on left that would fit current run.
      leftDeadEnd = true;
      break;
    }
  }

  // grab conflict cards on right that fit in current run until run size is at least minRunSize. Also grab non-conflict cards on right that
  // fit in current run and stop when hit conflict card and run is equal/above minRunSize OR
  // if the card value that would continue run on right isn't in changedHand.
  if (holder.length < minRunSize && !rightDeadEnd) {
    for (let count = rightSearchCount; count < changedHand.length; count++) {
      if (
        sameSuite(cardValue, cardValue + count) &&
        changedHand.includes(cardValue + count)
      ) {
        if (
          !isInSet(changedHand, cardValue + count) ||
          holder.length < minRunSize
        ) {
          holder.push(cardValue + count);
        } else {
          // we encountered a conflict card and we have a run of at least size 3
          break;
        }
      } else {
        //no more cards on right that would fit current run.
        rightDeadEnd = true;
        break;
      }
    }
  }

  // grab conflict cards on left that fit in current run until run size is at least minRunSize. Also grab non-conflict cards on left that
  // fit in current run and stop when hit conflict card and run is equal/above minRunSize OR
  // if the card value that would continue run on left isn't in changedHand.
  if (holder.length < minRunSize && !leftDeadEnd) {
    for (let count = leftSearchCount; count < changedHand.length; count++) {
      if (
        sameSuite(cardValue, cardValue - count) &&
        changedHand.includes(cardValue - count)
      ) {
        if (
          !isInSet(changedHand, cardValue - count) ||
          holder.length < minRunSize
        ) {
          holder.push(cardValue - count);
        } else {
          // we encountered a conflict card and we have a run of at least size 3
          break;
        }
      } else {
        //no more cards on left that would fit current run.
        leftDeadEnd = true;
        break;
      }
    }
  }

  if (holder.length < minRunSize) {
    console.log("ERROR in makeRun method.");
  }

  for (let value of holder) {
    theRuns.push(value);
    changedHand.splice(changedHand.indexOf(value), 1);
  }

  if (holder.length >= minRunSize + 2) {
    doOtherRuns[0] = false; //don't do minRunsize+1 run action if available
    doOtherRuns[1] = false; //don't do minRunsize+2 run action if available
    return doOtherRuns;
  }

  if (!rightDeadEnd || !leftDeadEnd) {
    if (holder.length == minRunSize + 1) {
      doOtherRuns[1] = true;
    } else if (holder.length == minRunSize) {
      doOtherRuns[0] = true; //do minRunsize+1 run action if available
      doOtherRuns[1] = false; //don't minRunsize+2 run action if available   will properly determine if can when do minRunSize+1
    }
  }
  return doOtherRuns;
}

function cleaningSets(changedHand, theSets) {
  let handForIterating = changedHand.slice(0); //NEED this since can't alter a list your iterating through without consequences
  let ignoreCards = [];
  for (let value of handForIterating) {
    if (
      !ignoreCards.includes(value % 13) &&
      isInSet(changedHand, value) &&
      !isInRun(changedHand, value)
    ) {
      continue;
    } else {
      ignoreCards.push(value % 13);
    }
  }

  //NEED to know which cards are eligible for perfect set before start removing since need to look at all 3 or 4 cards before can make decision
  // that is why need to loop twice.
  for (let value of handForIterating) {
    if (!ignoreCards.includes(value % 13)) {
      theSets.push(value);
      changedHand.splice(changedHand.indexOf(value), 1);
    }
  }
}

//Creates runs of size 3-5 if only the cards that would be part of a particular run are not eligible for being part of a set.
//Doesn't make a 3 run if there is a 4th card present in changedHand that can be part of the run but also part of a set.
// Don't want the creation of a run to affect any current conflict cards from no longer being conflict cards.
// Only eliminating cards I looked at. If cards that could be part of an eliminated run are able to form their own clean run without
//  needing those eliminated cards, will make the run. A 6 card run is already split into 2 separate runs.
function cleaningRuns(changedHand, theRuns) {
  let handForIterating = changedHand.slice(0); //NEED this since can't alter a list your iterating through without consequences
  let ignoreCards = [];

  for (let value of handForIterating) {
    if (isInRun(changedHand, value) && !isInSet(changedHand, value)) {
      continue;
    } else {
      ignoreCards.push(value);
    }
  }

  for (let value of handForIterating) {
    if (value % 13 > 10 || ignoreCards.includes(value)) {
      //value is a Queen or king which cannot ever be start of a run.
      continue;
    }

    //Need to look at minimum 3 cards before eliminating since can only eliminate bad runs. Also need to go
    // from lowest to highest so don't need to switch between +# and -#
    // have continues because otherwise would of the different ignoreCCards sections get run when one already did.
    // this helps cut down on code repetition.
    if (
      changedHand.includes(value) &&
      !ignoreCards.includes(value + 1) &&
      changedHand.includes(value + 1) &&
      !ignoreCards.includes(value + 2) &&
      changedHand.includes(value + 2)
    ) {
      //false means can't do a perfect 3 run

      if (changedHand.includes(value + 3) && value < 10) {
        //4th card
        if (!ignoreCards.includes(value + 3)) {
          //false means can't do a perfect 4 run
          if (changedHand.includes(value + 4) && value < 9) {
            //5th card
            if (!ignoreCards.includes(value + 4)) {
              //false means can't do a perfect 5 run
              if (changedHand.includes(value + 5) && value < 8) {
                //6th card
                //If 6 card exist, doesn't matter if in ignore cards, going to split anyway.
                theRuns.push(value);
                theRuns.push(value + 1);
                theRuns.push(value + 2);
                changedHand.splice(changedHand.indexOf(value), 1);
                changedHand.splice(changedHand.indexOf(value + 1), 1);
                changedHand.splice(changedHand.indexOf(value + 2), 1);
                ignoreCards.push(value); //don't want to re-consider cards we added, though the other 3 we looked at have potential for being in a run
                ignoreCards.push(value + 1);
                ignoreCards.push(value + 2);
                continue;
              } else {
                //no 6th proper run card   so a perfect run of 5
                theRuns.push(value);
                theRuns.push(value + 1);
                theRuns.push(value + 2);
                theRuns.push(value + 3);
                theRuns.push(value + 4);
                changedHand.splice(changedHand.indexOf(value), 1);
                changedHand.splice(changedHand.indexOf(value + 1), 1);
                changedHand.splice(changedHand.indexOf(value + 2), 1);
                changedHand.splice(changedHand.indexOf(value + 3), 1);
                changedHand.splice(changedHand.indexOf(value + 4), 1);
              }
            }
            ignoreCards.push(value); //don't want to re-consider cards we already looked at.
            ignoreCards.push(value + 1);
            ignoreCards.push(value + 2);
            ignoreCards.push(value + 3);
            ignoreCards.push(value + 4);
            continue;
          } else {
            //no 5th proper card   so a perfect run of 4
            theRuns.push(value);
            theRuns.push(value + 1);
            theRuns.push(value + 2);
            theRuns.push(value + 3);
            changedHand.splice(changedHand.indexOf(value), 1);
            changedHand.splice(changedHand.indexOf(value + 1), 1);
            changedHand.splice(changedHand.indexOf(value + 2), 1);
            changedHand.splice(changedHand.indexOf(value + 3), 1);
          }
        }
        ignoreCards.push(value); //don't want to re-consider cards we already looked at.
        ignoreCards.push(value + 1);
        ignoreCards.push(value + 2);
        ignoreCards.push(value + 3);
        continue;
      } else {
        //4th proper run card doesn't exist
        theRuns.push(value);
        theRuns.push(value + 1);
        theRuns.push(value + 2);
        changedHand.splice(changedHand.indexOf(value), 1);
        changedHand.splice(changedHand.indexOf(value + 1), 1);
        changedHand.splice(changedHand.indexOf(value + 2), 1);
      }
    }
    ignoreCards.push(value); //don't want to re-consider cards we already looked at.
    ignoreCards.push(value + 1);
    ignoreCards.push(value + 2);
  }
}

//determine if the two passed in cards are of the same suite
function sameSuite(value1, value2) {
  if (value1 < 13) {
    if (value2 < 13) {
      return true;
    }
  } else if (value1 < 26) {
    if (value2 >= 13 && value2 < 26) {
      return true;
    }
  } else if (value1 < 39) {
    if (value2 >= 26 && value2 < 39) {
      return true;
    }
  } else if (value1 < 52) {
    if (value2 >= 39 && value2 < 52) {
      return true;
    }
  }
  return false;
}

module.exports = {
  //so can use this class and methods in rest of project.
  deal10Cards,
  drawFromDeck,
  drawFromDiscard,
  removeCard,
  getMeldData,
  getHand,
  deckToDiscard,
  getTopDiscard,
  deleteRoom,
  doLayOffsAndScore
};
