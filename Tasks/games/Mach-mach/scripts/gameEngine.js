var flippedCounts = 0;
var lastFlipped = null;

function formCardList() {
    var cardsList = [];
    for (var x = 0; x < 5; x++) {
        for ( var y = 0; y < 14; y++) {
            cardsList.push((144*x) + "px " + (194*y) + "px")
        }
    }
    return cardsList;
}

function startgame () {

    this.flipped = 0;
    cardsList = formCardList();

    var cardQuantity = document.getElementById('difficulty').value;

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

        shuffledCards[placeForCard1] = document.createElement('div');
        shuffledCards[placeForCard1].rankAndSuit = cardtyphe;
        shuffledCards[placeForCard1].style.backgroundPosition = cardsList[cardtyphe];
        shuffledCards[placeForCard1].className = "closed-card";
        shuffledCards[placeForCard1].addEventListener("click", flipCard);

        shuffledCards[placeForCard2] = document.createElement('div');
        shuffledCards[placeForCard2].rankAndSuit = cardtyphe;
        shuffledCards[placeForCard2].style.backgroundPosition = cardsList[cardtyphe];
        shuffledCards[placeForCard2].className = "closed-card";
        shuffledCards[placeForCard2].addEventListener("click", flipCard);
    }

    for ( i = 0; i < cardQuantity; i++) {
        document.getElementById('cardholder').appendChild(shuffledCards[i])
    }
}

function flipCard() {
    switch(flippedCounts) {
        case 0:
            this.className = "open-card";
            lastFlipped = this;
            flippedCounts++;
            break;

        case 1:
            if (lastFlipped.rankAndSuit == this.rankAndSuit){
                this.style.visibility='hidden';
                lastFlipped.style.visibility = 'hidden';
                flippedCounts = 0;
            } else {
                this.className = "closed-card";
                lastFlipped.className = "closed-card";
                flippedCounts = 0
            }
            break;
    }
}