//todo NOTE as of 12-11, won't properly run since pug file not configured for it.

//todo NOTE, I put the test/debug code in here since didn't want to spend time
// trying to figure out how to properly do it in pug since tired and have a lot of other work NEED to focus on today 12/7 .

function displaySymbols1D(aList) {
    let theString = "";
    for (let i = 0; i < aList.length; i++) {
        theString += cardIdentify(aList[i]) + ",";
    }
    return theString;
}

function displaySymbols2D(aList) {
    let theString = "";
    for (let j = 0; j < aList.length; j++) {
        for (let i = 0; i < aList[j].length; i++) {
            theString += cardIdentify(aList[j][i]) + ", ";
        }
    }
    return theString;
}

function cardIdentify(value) {
    switch (value % 13) {
        case 0:
            return "Ace " + suiteIdentify(value);
        case 1:
            return "2 " + suiteIdentify(value);
        case 2:
            return "3 " + suiteIdentify(value);
        case 3:
            return "4 " + suiteIdentify(value);
        case 4:
            return "5 " + suiteIdentify(value);
        case 5:
            return "6 " + suiteIdentify(value);
        case 6:
            return "7 " + suiteIdentify(value);
        case 7:
            return "8 " + suiteIdentify(value);
        case 8:
            return "9 " + suiteIdentify(value);
        case 9:
            return "10 " + suiteIdentify(value);
        case 10:
            return "Jack " + suiteIdentify(value);
        case 11:
            return "Queen " + suiteIdentify(value);
        case 12:
            return "King " + suiteIdentify(value);
        default:
            return "UH OH";
    }
}

function suiteIdentify(value) {
    if (value < 13) {
        return "clubs";
    } else if (value < 26) {
        return "diamonds";
    } else if (value < 39) {
        return "hearts";
    } else {
        return "spades";
    }
}

//todo NOTE, so despite not making a class in serverSide.js, it still saved variables. So do need use of node.js and express.js
//  to make sure each client has there own variables otherwise game will be a non-working mess.

addCard(1);
addCard(2);
addCard(3);
addCard(16);
addCard(17);
addCard(18);
addCard(19);
addCard(10);
addCard(11);
addCard(12);

alert(displaySymbols1D(getHand()));//displayed just fine
formMelds(getHand());
alert("These are my runs  " + getRuns(1));
alert("These are my runs as symbols  " + displaySymbols2D(getRuns(1)));
alert("These are my sets  " + getSets(1));
alert("These are my sets as symbols " + displaySymbols2D(getSets(1)));
alert("These are my deadwood " + getDeadwoods());
alert("These are my deadwood as symbols " + displaySymbols1D(getDeadwoods()));
alert("This is my deadwood count " + getDeadwoodValue());