(function(){
    fnj = 'undefined' !== typeof fnj ? fnj : {};

    var Deck = {
        cards: [],
        currentCard: -1,
        init: function() {
            this.shuffleCards();
        },
        shuffleCards: function(){
            var deckSize = fnj.Card.signs.length * fnj.Card.numbers.length,
                cards = [],
                randomNumber;

            while(cards.length < deckSize) {
                randomNumber = Math.floor( Math.random() * deckSize );

                if(-1 === cards.indexOf(randomNumber)) {
                    cards.push(randomNumber);
                }
            }

            this.cards = cards;
        },
        getNext: function() {
            if(this.isEmpty()) {
                return false;
            }

            this.currentCard = this.cards.pop();

            return this.currentCard;
        },
        isEmpty: function() {
            return 0 === this.cards.length;
        }
    }

    fnj.Deck = Deck;
})();