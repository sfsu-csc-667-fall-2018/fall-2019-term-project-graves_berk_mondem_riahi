/*
This file exist to initialize database with a random deck.
Could be combined with other code involved with the creation and setup of room.
Just made it its own file for organization sake.

We won't be storing the games deck on server. Will have a deck stored on server that
is used to fill the database table deck when room is created.

orderNum
 */

class Deck {
  constructor() {
    this._deck = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51
    ];
  }

  generateRandomDeck() {
    this._deck.sort(function(a, b) {
      return 0.5 - Math.random();
    });
    //then go through loop and send request to database to fill it up.
  }
}
