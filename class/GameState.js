var _         = require("underscore");

var Field     = require("./Field"),
    Action   = require("./Action");

/**
 * Creates an instance of GameState.
 *
 * @constructor
 * @this {GameState}
 */
exports.GameState = function () {
	// Private Property;
    var field     = new Field.Field(); // Field Object
    var actions   = [];

    // Public Property
    this.count     = 1;
    this.nextPanels= generatePanel();
    this.actions   = [];
    this.field     = field.getField();  // Field Array for the Client

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
                var type = field.getElement(m, n);

                // Horizontal
                var rowrest = field.getRow(m).slice(n);
                var score = countValuesInArray(type, rowrest);
                if (score >= 3) {
                    field.handelHorizontalScore(m, n, score);
                    data = {
                        Score:  { 
                            type: type,
                            score: score,
                            orientation: "horizontal"
                        }
                    }
                    console.log("horizontal score found");
                    return new Action.Action("Score", data);
                }

                // Vertical
                var columnrest = field.getColumn(n).slice(m);
                var score = countValuesInArray(type, columnrest);
                if (score >= 3) {
                    field.handelVerticalScore(m, n, score);
                    data = {
                        Score:  { 
                            type: type,
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
    
    /**
    * Search in a array for a chain of Values and return the amount of them.
    * Example with inValue=2
    * 1.) [2, 2, 2, 5, 3] -> 3
    * 2.) [2, 3, 2, 4, 2] -> 1
    * @param {number} inValue - the Search value
    * @param {Array} inArray - the Array seach in
    * @returns {Number} - amount of values in the array
    */ 
    function countValuesInArray(inValue, inArray) {
        var scorecount = 0;
        var loop = true;
        // console.log(inArray);
        // console.log("inValue:" + inValue);
        var i = 0;
        while(loop && inValue != 0) {
            if (inArray[i] == inValue) {
                scorecount++;
                // console.log("scorecount:" + scorecount + ", i:" + i);
            } else if(inArray[i] != inValue) {
                loop = false;
            }
            
            i++;
        }

        return scorecount;
    }

    function addAction(inAction) {
        actions.push(inAction) ;
        console.log("action added from type: " + inAction.type);
    }

    // Public Methode
    this.update = function(m, n) {
        actions = [];

        var nextPanel = this.nextPanels[0];
        addAction( field.slidePanelIn(m, n, nextPanel));

        var loop = true;

        while(true) {
            var scoreaction = score();
            if (scoreaction == undefined) {
                break;
            }
            
            addAction( scoreaction );
        }

        // update nextPanel
        this.nextPanels = _.last(this.nextPanels, 2);
        this.nextPanels.push(getRandom(1,7));

        this.field = field.getField();  // Copy current Field
        this.actions = actions;         // Copy current Actions
        this.count++;
    }

    return this;
}