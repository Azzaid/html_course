__ = function (smth) {
    console.debug(this);
    console.debug(smth);
};


class Card {
    constructor(cardtyphe, backSideNumber) {
        this.domObj = document.createElement('div');
        this.domObj.classList.add("card");

        const backSide = document.createElement('img');
        backSide.classList.add("card_back");
        backSide.src = ("images/backs/" + backSideNumber + ".jpg");

        const frontSide = document.createElement('img');
        frontSide.classList.add("card_face");
        //frontSide.style.backgroundPosition = ((149*(cardtyphe%6)) + "px " + (227*Math.floor(cardtyphe/6)) + "px");
        frontSide.src = ("images/cards/" + cardtyphe + ".jpg");

        this.domObj.appendChild(backSide);
        this.domObj.appendChild(frontSide);
        this.rankAndSuit = cardtyphe;

    }

    flip() {
        this.classList.add('flipped');
    };

    UnFlip() {
        this.classList.remove('flipped');
    };

    vanquish() {
        this.classList.add('invisible');
    };

    getCard() {
        return this.domObj;
    };
}

class BackSideChooser {
    constructor() {
        this.sample = document.getElementById('sample')
        this.backSideNumber = 1;
    }

    nextBackSide() {
        if (this.backSideNumber < 3) {
            this.backSideNumber++;
        } else {
            this.backSideNumber = 1;
        }
        this.sample.src = ("images/backs/" + backSideNumber + ".jpg");
        return this.backSideNumber;
    };

    prevBackSide() {
        if (this.backSideNumber > 1) {
            this.backSideNumber += (-1);
        } else {
            this.backSideNumber = 3;
        }
        this.sample.src = ("images/backs/" + backSideNumber + ".jpg");
        return this.backSideNumber;
    }

}

class Timer {
    constructor() {
        this.startTime = Math.floor(Date.now() / 1000);
    }

    addLeadingZero(i) {
        if (i < 10) {
            i = "0" + i
        }
        ;
        return i;
    };

    startCount(self) {
        setInterval(function (self) {
            self.countTime()
        }, 500)
    };

    countTime() {
        let diff = Math.floor(Date.now() / 1000) - startTime;
        let m = Math.floor(diff / 60);
        let s = Math.floor(diff % 60);
        m = self.addLeadingZero(m);
        s = self.addLeadingZero(s);
        document.getElementById("timer").innerHTML = (m + ":" + s);
    };
}

class Game {

    constructor() {

        this.WinScreen = document.getElementById('winScreen');
        this.cardHolder = document.getElementById('cardholder');
        this.backSideNumber = 1;
        this.backSideChooser = new BackSideChooser();
    }

    nextBackSide() {
        this.backSideNumber = this.backSideChooser.nextBackSide();
    };

    prevBackSide() {
        this.backSideNumber = this.backSideChooser.prevBackSide();
    };

    shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        ;
        return array;
    }

    newGame() {

        document.getElementById('ruleset').classList.add('hidden');

        this.timer = new Timer();
        //this.timer.startCount(this.timer);

        const cardQuantity = document.getElementById('difficulty').value;
        this.pairsLeft = +cardQuantity;

        var cards = [];
        for (let i = 0; i < (+cardQuantity); i++) {
            cards.push(Math.floor(Math.random() * 70))
        }
        cards = cards.concat(cards);
        cards = this.shuffle(cards);

        cards = cards.map((item) => {
            let card = new Card(item, this.backSideNumber);
            card.domObj.onclick = (e) => {
                this.flipCard(e.target);
            };
            return card
        });

        cards.forEach((item) => {
            this.cardHolder.appendChild(item.getCard());
        });

        /*document.getElementsByClassName("card").forEach((item) => {
            item.onclick = () => {
                this.flipCard();
            };
        });*/

        const clearfix = document.createElement('div');
        clearfix.classList.add('clearfix');
        this.cardHolder.appendChild(clearfix);
    };

    flipCard(card) {
        let flippedCards = document.querySelectorAll('.flipped');
        let flippedCount = flippedCards.length;
        if (flippedCount < 2) {
            card.classList.add('flipped');
            if (flippedCount) {
                if (flippedCards[0].rankAndSuit == card.rankAndSuit) {
                    setTimeout(function () {
                        flippedCards[0].vanquish();
                        card.vanquish();
                        pairsLeft += (-1);
                        if (pairsLeft == 0) {
                            win();
                        }
                        ;
                    }, 1000);
                } else {
                    setTimeout(function () {
                        flippedCards[0].UnFlip();
                        card.UnFlip();
                    }, 1000);
                }
            }
        }
    };

    win() {
        WinScreen.classList.remove('hidden');
        setTimeout(function () {
            clearField()
        }, 5000)
    };

    clearField() {
        this.WinScreen.classList.add('hidden');
        this.cardHolder.childNodes.forEach(function (item) {
            cardHolder.removeChild(item);
        });
        document.getElementById('ruleset').classList.remove('hidden');
    }


}

function createNewGame() {
    let game = new Game();
    game.newGame();
}