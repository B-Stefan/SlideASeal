var _ = require("underscore");

var Action = require("./Action.js"),
    Field = require("./Field.js");

/**
 * Creates an instance of Field.
 *
 * @constructor
 * @this {Field}
 */
exports.Field = function () {
    /** @access private */
    //var field = generateTestField();
    var field = generateRandomField();

    // Private Methode
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateRandomField() {
        var newfield = []
        for(var i = 0; i < 5; i++) {
            newfield.push([getRandom(1, 7), getRandom(1, 7), getRandom(1, 7), getRandom(1, 7), getRandom(1, 7)]);
        }

        return newfield;
    }

    function generateTestField() {
        var newfield = [];
        
        newfield.push([1, 2, 3, 4, 2]);
        newfield.push([4, 2, 2, 2, 2]);
        newfield.push([1, 4, 6, 4, 4]);
        newfield.push([2, 3, 6, 4, 2]);
        newfield.push([2, 3, 3, 4, 2]);

        return newfield;
    }

    
    function slideHorizontalInLeft(m, inPanel) {
        var line = m - 1;

        var old = _.first(field[line], 4)
        field[line] = [inPanel];

        _.each(old, function(obj) {
             field[line].push(obj);
        });

        data = {
            SlideIn:  { type: inPanel, m: m, n:1, orientation: "horizontal" },
            SlideOut: { m: m, n:5 }
        }

        return new Action.Action("Slide", data);
    }

    function slideVerticalInTop(n, inPanel) {
        var line = n - 1;

        var input = inPanel;

        var newline = [ ]

        for(var i=0; i<5; i++) {
            newline.push(field[i][line]);
            field[i][line] = input;
            input = newline[i];
        }

        data = {
            SlideIn:  { type: inPanel, m: 1, n: n, orientation: "vertical"},
            SlideOut: { m: 5, n:n}
        }

        return new Action.Action("Slide", data);
    }

    function slideHorizontalInRight(m, inPanel) {
        var line = m - 1;
        field[line] = _.last(field[line], 4)
        field[line].push(inPanel);

        data = {
            SlideIn:  { type: inPanel, m: m, n:5, orientation: "horizontal" },
            SlideOut: { m: m, n:1 }
        }

        return new Action.Action("Slide", data);
    }

    function purgeColumn(inColumn) {
        var buffer = [];
        var newColumnArray = [];
        var columnArray = getColumn(inColumn);   

        var save =0;
        for(var i = 0; i<5; i++) {

            if(columnArray[i] != 0){
                buffer.push(columnArray[i]);
            } else {
                save++;
            }
        }

        for(var j = 0; j<save; j++) {
            newColumnArray.push(0);
        }

        for(var k = 0; k<buffer.length; k++) {
            newColumnArray.push(buffer[k]);
        }

        setColumn(inColumn, newColumnArray);
    }

    function purgeSpaces() {
        for(var i = 0; i < 5; i++) {
            purgeColumn(i);
        } 
    }

    function getElement(m, n) {
        return field[m][n];
    }

    function getColumn(inColumn) {
        var column = [];

        for(var i=0; i<5; i++) {
            column.push(field[i][inColumn]);
        }

        return column;
    }

    function setColumn(inColumn, inArray) {
        for(var i=0; i<5; i++) {
            field[i][inColumn] = inArray[i];
        }
    }

    function getRow(inRow) {
         var row = [];

        for(var i=0; i<5; i++) {
            row.push(field[inRow][i]);
        }

        return row;
    }

    // Public Methode   
    this.slidePanelIn = function (m, n, newPanel) {
        if(n == 0) {
            return slideHorizontalInLeft(m, newPanel);
        } else if (m == 0) {
            return slideVerticalInTop(n, newPanel);
        } else if (n == 6) {
            return slideHorizontalInRight(m, newPanel);
        }
    }

    this.handelHorizontalScore = function (inM, inN, inScore) {
        for(var i = 0; i<inScore; i++) {
            field[inM][inN + i] = 0;
        }
        purgeSpaces();
    }

    this.handelVerticalScore = function (inM, inN, inScore) {
        for(var i = 0; i<inScore; i++) {
            field[inM + i][inN] = 0;
        }
        purgeSpaces();
    }

    this.getField = function () {
        return field;
    }

    this.getElement = function(m, n) {
        return getElement(m, n);
    }

    this.getColumn = function(inColumn) {

        return getColumn(inColumn);
    }

    this.getRow = function(inRow) {
        return getRow(inRow);
    }

    return this;
}

/**
* Search in a array for a series of types and return the amount of them.
*
* Example with inType=2
* 1.) [2, 2, 2, 5, 2] -> 3
* 2.) [2, 3, 2, 4, 2] -> 1
*
* @param {number} inValue - the Search value
* @param {Array} inArray - the Array seach in
* @returns {Number} - amount of values in a series
*/ 
exports.countPanelsInSerie = function (inType, inArray) {
    var count = 0;
    var loop = true;

    var i = 0;
    while(loop && inType != 0) {
        if (inArray[i] == inType) {
            count++;
        } else if(inArray[i] != inType) {
            loop = false;
        }
        
        i++;
    }

    return count;
}