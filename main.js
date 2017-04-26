var BJ = {
    stage: null,
    cards: [
        { x: 50, y: 50, value: -1, static: true },
        { x: 250, y: 50, value: -1, static: true },
        { x: 450, y: 50, value: -1, static: true },
        { x: 150, y: 300, value: -1, static: false },
        { x: 350, y: 300, value: -1, static: false }
    ],
    cardClicked: false,
    working: false,
    deckObj: {},
    queue: [],
    init: function() {
        this.setupStage();
        this.drawBackground();
        this.initDeck();
        this.showCards();
        this.initTicker();
    },
    setupStage: function() {
        this.stage = new createjs.Stage(document.getElementById('canvas'));
        this.stage.enableMouseOver();
    },
    initTicker: function() {
        createjs.Ticker.setFPS(60);
        createjs.Ticker.addEventListener("tick", function(e) {
            BJ.stage.update();
        });
    },
    initDeck: function() {
        fnj.Deck.init();
        this.showButton();
    },
    showCards: function() {
        var deck = new createjs.Container();

        deck.addChild(fnj.Card.getBack());

        deck.alpha = .5;

        deck.x = 700;
        deck.y = 100;

        BJ.deckObj = deck;

        BJ.stage.addChild(deck);

        this.showNext();
    },
    showButton: function() {
        this.button = new fnj.Button('Hit');

        this.stage.addChild(this.button);
    },
    clickOnCard: function(index) {
        BJ.cardClicked = true;
        BJ.cards[index].value = -1;
    },
    gameOver: function() {
        BJ.cards.forEach(function(card) {
            card.cardObj.removeAllEventListeners();
        });
        BJ.showEndScreen();
    },
    showEndScreen: function() {
        var cw = BJ.stage.canvas.width, ch = BJ.stage.canvas.height;
        var goBack = new createjs.Shape();
        var layerMask = new createjs.Shape();
        var goContainer = new createjs.Container();

        goBack.graphics.beginFill('#FFF').drawRoundRect(0,0,cw/2,ch/2,5,5,5,5).endFill();
        layerMask.graphics.beginFill('#FFF').drawRoundRect(0,0,cw,ch,5,5,5,5).endFill();
        layerMask.alpha = .7;

        goBack.shadow = new createjs.Shadow('#000', 0, 0, 10);

        goContainer.regX = cw/4;
        goContainer.regY = ch/4;
        goContainer.x = cw / 2;
        goContainer.y = ch / 2;

        var goText = new createjs.Text('GAME OVER', "64px Times", '#000');
        var ngText = new createjs.Text('NEW GAME', "64px Times", '#008');

        goText.y = ch/10;
        goText.x = ( cw/2 - ngText.getMeasuredWidth() ) / 2;

        ngText.y = ngText.getMeasuredHeight() + ch/5;
        ngText.x = ( cw/2 - ngText.getMeasuredWidth() ) / 2;
        ngText.cursor = 'pointer';

        var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").drawRect(0, 0, ngText.getMeasuredWidth(), ngText.getMeasuredHeight());
        ngText.hitArea = hit;

        ngText.on('click', function() {
            BJ.stage.removeChild(layerMask, goContainer);
            BJ.newGame();
        });

        goContainer.addChild(goBack, goText, ngText);
        BJ.stage.addChild(layerMask, goContainer);
    },
    newGame: function() {
        BJ.cards.forEach(function(card, index) {
            card.cardObj.throw();
            BJ.cards[index].value = -1;
        });
        BJ.initDeck();
        BJ.showCards();
    },
    showNext: function(e) {
        if(fnj.Deck.isEmpty()) {
            BJ.gameOver();

            return;
        }

        if(BJ.working && arguments.callee.caller && arguments.callee.caller.name === 'MouseDown') {
            BJ.queue.push(true);

            return;
        }
        var freeCard, index;
        BJ.cards.forEach(function(card, i){
            if(card.value === -1 && freeCard === undefined) {
                freeCard = card;
                index = i;
            }
        });
        if(freeCard === undefined) {
            BJ.working = false;
            BJ.cardClicked = false;
            if(BJ.queue.pop()) {
                BJ.setEmpty();
                BJ.showNext();
            }
            return;
        }

        cardNumber = fnj.Deck.getNext();

        var newCard = new fnj.Card(Math.floor(cardNumber / fnj.Card.signs.length), cardNumber % fnj.Card.signs.length, freeCard.static);
        BJ.working = true;
        BJ.cards[index].value = cardNumber;
        BJ.cards[index].cardObj = newCard;
        BJ.stage.addChild(newCard);
        newCard.index = index;
        newCard.move(freeCard.x, freeCard.y, BJ.showNext);
    },
    setEmpty: function() {
        if(BJ.working || BJ.cardClicked) {
            return;
        }
        BJ.cards.forEach(function(card, index) {
            if(!card.static) {
                card.cardObj.throw();
                BJ.cards[index].value = -1;
            }
        });
    },
    drawBackground: function() {
        var backGround = new createjs.Shape();
        backGround.graphics.beginFill('#F8F8F8').drawRect(25,25,625, 500).endFill();
        backGround.shadow = new createjs.Shadow('#000', 0, 0, 5);
        this.stage.addChild(backGround);
    }
}

function init() {
    BJ.init();
}