
let cardPair = [];
let openCards = [];
let moveCounter = 0;
let scoreCounter = 0;
let gameEnd = false;
var timeStart;

var timeInterval;
let time_Total = "";
let star_Counter = 10;


function cardArray() {
    let card_vals = ["fa fa-diamond","a fa-paper-plane-o","fa fa-anchor","fa fa-bolt","fa fa-cube","fa fa-bomb","a fa-leaf","fa fa-bicycle"];
    let cardPair = [...card_vals, ...card_vals];
    return cardPair;

}


function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

///////////////////////////////////////////////////////////////
/// This function will add class to card elements and append //
///                to the fragment.                         ///
///////////////////////////////////////////////////////////////
function init() {

    cardPair = [];
    openCards = [];
    scoreCounter = 0;
    moveCounter = -1;
    gameEnd = false;

    moveUpdater();
    update_scoreCounter(true);

    cardPair = cardArray();
    cardPair = shuffle(cardPair);

    var fragment = document.createDocumentFragment();
    var deck = document.getElementById('deck');
    for (var card_val of cardPair) {
        let cardHtml = document.createElement("li");
        
        cardHtml.classList.add("card");
        let cardFont = document.createElement("i");
        cardHtml.appendChild(cardFont);
        cardHtml.addEventListener("click", cardToggle)
        cardFont.classList.add("fa");
        cardFont.classList.add(card_val.split(' ')[1]);
        fragment.appendChild(cardHtml);
    }
    deck.appendChild(fragment);

    show("gameBoard");
    Timer(); 

      
}
/* DomEventListenr on Loading the Content */
document.addEventListener("DOMContentLoaded", function (event) {

    init();  

});
/* moveUpdater() will update each move */
function moveUpdater() {
    moveCounter++;
    document.getElementById('moves').innerText = moveCounter;

}

function gameReset() {
	const popup = document.getElementById('winPopup');
	popup.classList.add('hide');
    gameEnd = true;
    clearInterval(timeInterval);       
    var deck = document.getElementById('deck');
    deck.innerHTML = "";
    init();

}
function Timer() {
    let timeStart = new Date().getTime();
    timeInterval = setInterval(function () {
        var now = new Date().getTime();
        var t = now - timeStart;
        var day = Math.floor(t / (1000 * 60 * 60 * 24));
        var hour = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minute = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((t % (1000 * 60)) / 1000);
        time_Total = minute + "m " + seconds + "s ";
        document.getElementById("timer").innerHTML = time_Total;
        if (gameEnd) {
            clearInterval(timeInterval);          
        }
    }, 1000);

}
function update_scoreCounter(reset) {
    let starsContainer = document.getElementById("stars");

    if (reset) {      
        for (var i = 0; i < starsContainer.children.length; i++) {
            star = starsContainer.children[i];
            star.classList.remove("remove-star");
        }
    }
    else {
        var star_Step_Counter = (moveCounter % star_Counter == 1) && (moveCounter <= ((star_Counter * 3) + 1));
        if (star_Step_Counter) {
           
            if (moveCounter < star_Counter) {
                scoreCounter = 3;
            }
            else if (moveCounter >= star_Counter && moveCounter < (star_Counter * 2)) {
                scoreCounter = 2;
                starsContainer.children[0].classList.add("remove-star");
            }
            else if (moveCounter >= (star_Counter * 2) && moveCounter <= (star_Counter * 3)) {
                scoreCounter = 1;
                starsContainer.children[1].classList.add("remove-star");

            }
            else {
                scoreCounter = 0;
                starsContainer.children[2].classList.add("remove-star");
            }
        }
    }

}
// It will toggle card and check for match and unmatch //
function cardToggle(card) {


    card = card.target;
    if (!card.classList.contains("open")) {
        card.classList.add("open");
        card.classList.add("show");
        openCards.push(card);
        if (openCards && openCards.length > 0 && openCards.length % 2 == 0) {
            let card1 = openCards[openCards.length - 2];
            let card2 = openCards[openCards.length - 1];
            let match = matchChecker(card1, card2);
            if (match) {
                card1.classList.add('match');
                card2.classList.add('match');

            }
            else {
                card1.classList.add('mismatch');
                card2.classList.add('mismatch');

                setTimeout(() => {
                    card1.classList.remove("open");
                    card1.classList.remove("show");
                    card1.classList.remove("mismatch");

                    card2.classList.remove("open");
                    card2.classList.remove("show");
                    card2.classList.remove("mismatch");

                }, 1000);
                openCards.splice(-2, 2);

            }
            moveUpdater();
            update_scoreCounter(false);
            if (openCards.length == cardPair.length) {
                gameEnd = true;
                clearInterval(timeInterval);
                hider("gameBoard");
                show("winPopup");
                document.getElementById("winInfo").innerText = `With ${moveCounter} Moves and ${scoreCounter} Stars and ${time_Total}`;

            }

        }

    }

}
function show(element) {
    let e = document.getElementById(element);
    if (e)
        document.getElementById(element).classList.remove('hide');
}
function hider(element) {
    let e = document.getElementById(element);
    if (e)
        document.getElementById(element).classList.add('hide');
}
// Called by cardToggle function to match the Class of the card //
function matchChecker(card1, card2) {
    return card1.firstChild.classList.value == card2.firstChild.classList.value;
}




/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final scoreCounter (put this functionality in another function that you call from this one)
 */
