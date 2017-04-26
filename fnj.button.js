(function(){
	fnj = typeof fnj === 'undefined' ? {} : fnj;
	var Button = function(text) {
		this.text = text;
		this.initialize();
		this.x = 775;
		this.y = 450;
	}
	var b = Button.prototype = new createjs.Container();

	b.Container_initialize = b.initialize;

    b.initialize = function() {
        this.Container_initialize();
        this.createLayout();
    }

    b.createLayout = function() {
    	var outerShape = new createjs.Shape();
    	var outerShapeHover = new createjs.Shape();
    	var outerShapePush = new createjs.Shape();
    	var text = new createjs.Text(this.text.toUpperCase(), '32px Times', '#FFF');
    	var tb = text.getBounds();
    	text.x = -tb.width / 2;
    	text.y = -tb.height / 2;
    	outerShape.graphics.beginFill('#F00').drawCircle(0,0,50).endFill();
    	outerShapeHover.graphics.beginFill('#F33').drawCircle(0,0,50).endFill();
    	outerShapePush.graphics.beginFill('#D00').drawCircle(0,0,50).endFill();

        outerShapeHover.visible = outerShapePush.visible = false;

    	outerShape.shadow = outerShapePush.shadow = new createjs.Shadow('#000', 0, 0, 2);

    	outerShapeHover.shadow = new createjs.Shadow('#000', 0, 0, 5);

    	this.on('mouseover', function() {
            outerShapeHover.visible = true;
    		outerShape.visible = outerShapePush.visible = false;
            text.y -= 2;
            text.x -= 2;
    	});
    	this.on('mouseout', function() {
            outerShape.visible = true;
    		outerShapeHover.visible = outerShapePush.visible = false;
            text.y += 2;
            text.x += 2;
    	});
    	this.on('mousedown', function MouseDown() {
            BJ.setEmpty();
            BJ.showNext();
            outerShapePush.visible = true;
            outerShape.visible = outerShapeHover.visible = false;
            text.y += 2;
            text.x += 2;
    	});
    	this.on('pressup', function() {
            text.y -= 2;
            text.x -= 2;
            outerShapeHover.visible = true;
            outerShape.visible = outerShapePush.visible = false;
    	});
    	this.cursor = 'pointer';

    	this.addChild(outerShapeHover, outerShape, outerShapePush, text);
    }

	fnj.Button = Button;
}());