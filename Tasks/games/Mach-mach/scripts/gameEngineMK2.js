var flippedCount = 0;
var lastFlipped = null;
var backSideNumber = 1;
var pairsLeft = 0;
var startTime =0;

function nextBackSide() {
    if (backSideNumber < 3) {
        backSideNumber++;
    } else {
        backSideNumber=1;
    }
    document.getElementById('sample').src = ("images/backs/" + backSideNumber + ".jpg");
}
function prevBackSide() {
    if (backSideNumber > 1) {
        backSideNumber+=(-1);
    } else {
        backSideNumber=3;
    }
    document.getElementById('sample').src = ("images/backs/" + backSideNumber + ".jpg");
}

function CreateCard (place, cardtyphe) {

    const card = document.createElement('div');
    card.className = "card";
    
    const backSide = document.createElement('img');
        backSide.className = "card_back";
        backSide.src = ("images/backs/" + backSideNumber + ".jpg");



    const frontSide = document.createElement('img');
        frontSide.className = "card_face";
        //frontSide.style.backgroundPosition = ((149*(cardtyphe%6)) + "px " + (227*Math.floor(cardtyphe/6)) + "px");
        frontSide.src = ("images/cards/" + cardtyphe + ".jpg");

    card.appendChild(backSide);
    card.appendChild(frontSide);
    card.rankAndSuit = cardtyphe;
    card.addEventListener("click", flipCard);
    return(card)
}

function addLeadinZero(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

function countTime() {
    var now = Math.floor(Date.now() / 1000);
    var diff = now - startTime;
    var m = Math.floor(diff / 60);
    var s = Math.floor(diff % 60);
    m = addLeadinZero(m);
    s = addLeadinZero(s);
    document.getElementById("timer").innerHTML = ( m + ":" + s );
}



function startgame () {

    hideWinScreen();

    var cardQuantity = document.getElementById('difficulty').value;
    pairsLeft = +cardQuantity;

    const cardHolder = document.getElementById('cardholder');

    startTime = Math.floor(Date.now() / 1000);
    setInterval(countTime, 500);



    //document.getElementById('ruleset').style.display = "none";

    for (;cardHolder.childNodes.length > 0;) {
        var child = cardHolder.childNodes[0];
        cardHolder.removeChild(child);
    }

    var freeSlots = [];
    for (var i = 0; i < cardQuantity*2; i++) {
        freeSlots.push(i);
    }

    var shuffledCards = Array(cardQuantity*2);
    for (var i = 0; i < cardQuantity; i++) {
        cardtyphe = Math.floor(Math.random()*70);
        randomIndex = Math.floor(Math.random()*freeSlots.length);
        placeForCard1 = freeSlots[randomIndex];
        freeSlots.splice(randomIndex, 1);
        randomIndex = Math.floor(Math.random()*freeSlots.length);
        placeForCard2 = freeSlots[randomIndex];
        freeSlots.splice(randomIndex, 1);

        shuffledCards[placeForCard1] = CreateCard(placeForCard1, cardtyphe);
        shuffledCards[placeForCard2] = CreateCard(placeForCard2, cardtyphe);
    }

    for (var i = 0; i < cardQuantity*2; i++) {
        document.getElementById('cardholder').appendChild(shuffledCards[i])
    }
    const clearfix = document.createElement('div');
    clearfix.classList.add('clearfix');
    document.getElementById('cardholder').appendChild(clearfix);
}

function flipCard() {
    if (flippedCount == 1) {
        flippedCount++;
        if (lastFlipped.rankAndSuit == this.rankAndSuit && lastFlipped!==this){
            this.classList.add('flipped');
            var item = this;
            setTimeout(function () {wanquish(item)}, 1000);

        } else {
            this.classList.add('flipped');
            var item = this;
            setTimeout(function () {backFlip(item)}, 1000);
        }
    } else if (flippedCount == 0) {
        this.classList.add('flipped');
        lastFlipped = this;
        flippedCount++;
    }
}

function backFlip(item) {
    item.classList.remove('flipped');
    lastFlipped.classList.remove('flipped');
    flippedCount = 0
}

function wanquish(item) {
    item.style.visibility = 'hidden';
    lastFlipped.style.visibility = 'hidden';
    flippedCount = 0;
    pairsLeft+=(-1);
    if (pairsLeft == 0) {
        showWinScreen();
    }
}

function showWinScreen() {
    document.getElementById('winScreen').style.display = "block";
}
function hideWinScreen() {
    document.getElementById('winScreen').style.display = "none";
}