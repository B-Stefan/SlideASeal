var _         = require("underscore");

var Field     = require("./Field"),
    Action   = require("./Action");

/**
 * Creates an instance of GameState.
 *
 * @constructor
 * @this {GameState}
 * @returns {this}
 */
exports.GameState = function () {
	/** @access private */
    var field           = new Field.Field();    // Field Object
    var actions         = [];                   
    var sliderSocket    = undefined;            // this socket can 
    var started         = false;

    /** @access public */
    this.count          = 1;
    this.nextPanels     = generatePanel();
    this.actions        = [];
    this.field          = field.getField();     // Field Array for the Client

    // Private Methode
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generatePanel() {
        var nextPanel = [];

        for(var i = 0; i<3; i++) {
            nextPanel.push(getRandom(1,7));
        }

        return nextPanel;
    }

    function score() {
        for(var m = 0; m<5; m++) {
            for(var n = 0; n<5; n++) {

                // horizontal
                var type = field.getElement(m, n);
                var rowrest = field.getRow(m).slice(n);
                var count = Field.countPanelsInSerie(type, rowrest);
                if (count >= 3) {
                    field.handelHorizontalScore(m, n, count);

                    var score = getScoreValue(type, count);
                    sliderSocket.score += score;

                    data = {
                        Score:  {
                            m: m,
                            n: n,
                            type: type,
                            count: count,
                            score: score,
                            orientation: "horizontal"
                        }
                    }

                    console.log("horizontal score found");
                    return new Action.Action("Score", data);
                }

                // vertical
                var type = field.getElement(m, n);
                var columnrest = field.getColumn(n).slice(m);
                var count = Field.countPanelsInSerie(type, columnrest);
                if (count >= 3) {
                    field.handelVerticalScore(m, n, count);

                    var score = getScoreValue(type, count);
                    sliderSocket.score += score;

                    data = {
                        Score:  {
                            m: m,
                            n: n,
                            type: type,
                            count: count,
                            score: score,
                            orientation: "vertical"
                        }
                    }

                    console.log("vertical score found");
                    return new Action.Action("Score", data);
                }
            }
        }

        console.log("no score found");
        return undefined;
    }

    function getScoreValue(inType, inCount) {
        var value;
        var multiplier;

        switch(inType) {
            case 7:
                // plutonium barrel
                value = 150;
                break;
            case 6:
                // fish
                value = 100;
                break;
            case 5:
                // waterball
                value = 70;
                break;
            case 4:
                // fish remains
                value = 40;
                break;
            case 3:
                // life ring
                value = 30;
                break;
            case 2:
                // steering wheel
                value = 20;
                break;
            case 1:
                // anchor
                value = 10;
                break;
        }

        switch(inCount) {
            case 3: 
                multiplier = 1;
                break;
            case 4:
                multiplier = 2;
                break;
            case 5:
                multiplier = 3;
                break;
        }

        return value * multiplier;
    }
    
    function addAction(inAction) {
        actions.push(inAction) ;
        console.log("action added from type: " + inAction.type);
    }

    this.startGame = function() {
        started = true;
    }

    this.isStarted = function() {
        return started;
    }

    // Public Methode
    this.update = function(inSocket, inSession, inM, inN) {

        if(inSocket == sliderSocket) {
            console.log("Player " + inSocket.name + " slided at " + inM + ", " + inN);

            actions = [];

            var nextPanel = this.nextPanels[0];
            addAction( field.slidePanelIn(inM, inN, nextPanel));

            var loop = true;

            while(true) {
                var scoreaction = score();
                if (scoreaction == undefined) {
                    break;
                }
                    
                addAction(scoreaction);
            }

            // Switch the current Player, if no score happend
            if(actions.length == 1) {
                var nextSliderSocket = inSession.getOtherSocket(inSocket);
                console.log("now its " + nextSliderSocket.name + "turn!")

                this.setSliderSocket( nextSliderSocket);
            }


            // update nextPanel
            this.nextPanels = _.last(this.nextPanels, 2);
            this.nextPanels.push(getRandom(1,7));

            this.field = field.getField();  // Copy current Field
            this.actions = actions;         // Copy current Actions
            this.count++;
        } else {
            console.log("not Player " + inSocket.name + " turn!");
        }
    }

    this.setSliderSocket = function(inSocket) {
        sliderSocket = inSocket;
    }

    return this;
}