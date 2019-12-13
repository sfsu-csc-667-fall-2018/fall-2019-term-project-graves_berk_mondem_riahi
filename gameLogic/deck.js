const sortArray = require('array-sort')//needed so can sort array in generateRandomDeck.


class Deck {
    get deck() {
        return this._deck;
    }

    constructor() {
        this._deck = [0,1,2,3,4,5,6,7,8,9,10,11,12,
            13,14,15,16,17,18,19,20,21,22,23,24,25,
            26,27,28,29,30,31,32,33,34,35,36,37,38,
            39,40,41,42,43,44,45,46,47,48,49,50,51];
    }

}

function generateRandomDeck(){
    return sortArray(new Deck().deck,function(a,b){return 0.5 - Math.random()});
}

module.exports = {//so can use this class and methods in rest of project.
   Deck,
    generateRandomDeck
}