(function() {
    fnj = typeof fnj === 'undefined' ? {} : fnj;
    var Card = function(number, sign, isStatic) {
        this.sign = Card.signs[sign];
        this.number = Card.numbers[number];
        this.isStatic = isStatic;
        this.backContainer = null;
        this.skewWay = -1;
        this.skewMax = 10;
        this.initialize();
    }

    var c = Card.prototype = new createjs.Container();

    Card.dimensions = {
        width: 150,
        height: 200
    }
    Card.numbers = [ 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K' ];
    Card.signs = [ 'spade', 'diamond', 'heart', 'club' ];

    Card.signConf = {
        'spade': {
            code: 9824,
            color: "#000"
        },
        'diamond': {
            code: 9830,
            color: "#F00"
        },
        'heart': {
            code: 9829,
            color: "#F00"
        },
        'club': {
            code: 9827,
            color: "#000"
        }
    }

    c.Container_initialize = c.initialize;

    c.initialize = function() {
        this.Container_initialize();
        this.createLayout();
    }

    c.createLayout = function() {
        this.createFront();
        this.createBack();
        this.setPosition();
    }

    c.setPosition = function() {
        this.x = 700;
        this.y = 100;
    }

    c.throw = function() {
        var me = this;
        createjs.Tween.get(me).to({y: me.y + 200, alpha: 0}, 100).call(function() {
            me.removeAllEventListeners();
            BJ.stage.removeChild(me);
        });
    }

    c.move = function(x, y, cb) {
        cb = cb || function(){};
        var me = this;
        var skewHandler = function(e) {
            if (me.skewWay === 1 && me.skewX === 0) {
                createjs.Ticker.removeEventListener('tick', skewHandler);
                return;
            }

            if ((me.skewX >= me.skewMax && me.skewWay === 1) || (me.skewX <= -me.skewMax && me.skewWay === -1)) {
                me.setChildIndex(me.getChildAt(0), me.children.length - 1);
                me.skewWay *= -1;
            }
            me.skewX += me.skewWay;
            me.skewY -= me.skewWay * 0.5;
            me.scaleX = ((me.skewMax - Math.abs(me.skewX)) / me.skewMax);
        };
        createjs.Ticker.addEventListener("tick", skewHandler);
        createjs.Tween.get(this).to({
            x: this.x + (this.x - x) / 10,
            y: this.y + (this.y - y) / 10
        }, 100).to({
            x: x,
            y: y
        }, 500, createjs.Ease.getPowIn(2.2)).call(function() {
            if(!this.isStatic) {
                this.attachClick();
            }
            cb();
        });
    }

    c.attachClick = function() {
        this.on('click', function() {
            BJ.clickOnCard(this.index);
            this.throw();
        });
    }

    c.createBack = function() {
        var me = Card;

        if (me.backContainer) {
            this.addChild(me.backContainer);
            return;
        }

        me.backContainer = Card.getBack();
        
        if(!this.number) {
            debugger;
        }
        this.addChild(me.backContainer);
    }

    Card.getBack = function() {
        var backContainer = new createjs.Container();
        var backBorder = new createjs.Shape();
        var mask = new createjs.Shape();
        mask.graphics.drawRoundRect(0, 0, Card.dimensions.width, Card.dimensions.height, 5, 5, 5, 5);
        backBorder.graphics.setStrokeStyle(1)
            .beginStroke("#000")
            .drawRoundRect(0, 0, Card.dimensions.width, Card.dimensions.height, 5, 5, 5, 5)
            .endStroke();
        for (i = 0; i <= 36; i++) {
            var backImg = new createjs.Shape();
            backImg.graphics.beginFill(i % 2 ? "#000" : "#FFF").drawRect(0, 0, 200 - i * (5 / 0.9), 200 - i * (5 / 0.9));
            backImg.rotation = 90 - 5 * i;
            backImg.regX = backImg.regY = 100 - i * 2.5;
            backImg.x = 75;
            backImg.y = 100;
            backContainer.addChild(backImg);
        }
        backContainer.mask = mask;
        backContainer.addChild(backBorder);
        backContainer.cache(0,0,Card.dimensions.width, Card.dimensions.height);

        return backContainer;
    }

    c.createFront = function() {
        if(this.number == 'B') {
            return;
        }
        var me = Card;
        var frontContainer = new createjs.Container();
        var textUp = new createjs.Text(this.number, "20px Arial", me.signConf[this.sign].color);
        var sign = new createjs.Text(String.fromCharCode(me.signConf[this.sign].code), "160px Arial", me.signConf[this.sign].color);
        var textDown = new createjs.Text(this.number, "20px Arial", me.signConf[this.sign].color);
        var frontBorder = new createjs.Shape();

        frontBorder.graphics.setStrokeStyle(1)
            .beginStroke("#000")
            .beginFill("#FFF")
            .drawRoundRect(0, 0, Card.dimensions.width, Card.dimensions.height, 5, 5, 5, 5);

        textUp.x = 10;
        textUp.y = 10;

        textDown.x = 140;
        textDown.y = 190;
        textDown.scaleY = textDown.scaleX = -1;

        var sb = sign.getBounds();

        sign.regX = sb.width / 2;
        sign.regY = sb.height / 2;

        sign.x = 75;
        sign.y = 90;

        frontContainer.addChild(frontBorder, textUp, textDown, sign);

        this.addChild(frontContainer)
    }

    fnj.Card = Card;
})();