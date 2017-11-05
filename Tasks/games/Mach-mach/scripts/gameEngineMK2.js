var flippedCount = 0;
var lastFlipped = null;
var backSideNumber = 0;

function nextBackSide() {
    if (backSideNumber < 3) {
        backSideNumber++;
        document.getElementById('sample').style.backgroundPosition = (144*backSideNumber + "px " + 0 + "px");
    } else {
        backSideNumber=0;
        document.getElementById('sample').style.backgroundPosition = (144*backSideNumber + "px " + 0 + "px");
    }

}
function prevBackSide() {
    if (backSideNumber > 0) {
        backSideNumber+=(-1);
        document.getElementById('sample').style.backgroundPosition = (144*backSideNumber + "px " + 0 + "px");
    } else {
        backSideNumber=3;
        document.getElementById('sample').style.backgroundPosition = (144*backSideNumber + "px " + 0 + "px");
    }
}

function CreateCard (place, cardtyphe) {

    const card = document.createElement('div');
    card.className = "card";
    
    const backSide = document.createElement('div');
        backSide.className = "card_back";
        backSide.style.backgroundPosition = (144*backSideNumber + "px " + 0 + "px");

    const frontSide = document.createElement('div');
        frontSide.className = "card_face";
        frontSide.style.backgroundPosition = ((144*(cardtyphe%4)) + "px " + (194*Math.floor(cardtyphe/4)) + "px");

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

function countTime(startTime) {
    var now = Math.floor(Date.now() / 1000);
    var diff = now - startTime;
    console.debug(diff);
    var m = Math.floor(diff / 60);
    var s = Math.floor(diff % 60);
    m = addLeadinZero(m);
    s = addLeadinZero(s);
    document.getElementById("timer").innerHTML = ( m + ":" + s );
}



function startgame () {

    var cardQuantity = document.getElementById('difficulty').value;
    var startTime = Math.floor(Date.now() / 1000);
    setInterval(countTime(startTime), 500);

    document.getElementById('ruleset').style.display = "none";

    var freeSlots = [];
    for (var i = 0; i < cardQuantity; i++) {
        freeSlots.push(i);
    }

    var shuffledCards = Array(cardQuantity);
    for ( i = 0; i < cardQuantity; i++) {
        cardtyphe = Math.floor(Math.random()*52);
        randomIndex = Math.floor(Math.random()*freeSlots.length);
        placeForCard1 = freeSlots[randomIndex];
        freeSlots.splice(randomIndex, 1);
        randomIndex = Math.floor(Math.random()*freeSlots.length);
        placeForCard2 = freeSlots[randomIndex];
        freeSlots.splice(randomIndex, 1);

        shuffledCards[placeForCard1] = CreateCard(placeForCard1, cardtyphe);
        shuffledCards[placeForCard2] = CreateCard(placeForCard2, cardtyphe);
    }

    for ( i = 0; i < cardQuantity; i++) {
        document.getElementById('cardholder').appendChild(shuffledCards[i])
    }
    const clearfix = document.createElement('div');
    clearfix.classList.add('clearfix');
    document.getElementById('cardholder').appendChild(clearfix);
}

function flipCard() {
    if (flippedCount) {
        if (lastFlipped.rankAndSuit == this.rankAndSuit && lastFlipped!==this){
            this.classList.add('flipped');

            wanquish = (item) => {
                item.style.visibility = 'hidden';
                lastFlipped.style.visibility = 'hidden';
                flippedCount = 0;
            }
            setTimeout(wanquish(this), 1000);

        } else {
            this.classList.add('flipped');

            backFlip = (item) => {
                this.classList.remove('flipped');
                lastFlipped.classList.remove('flipped');
                flippedCount = 0
            }

            setTimeout(backFlip(this), 3000);
        }
    } else {
        this.classList.add('flipped');
        lastFlipped = this;
        flippedCount++;
    }
}