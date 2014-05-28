var _ = require("underscore");

var Action = require("./Action.js");

exports.Field = function () {
	// Private Property;
    //var field = generateTestField();
    var field = generateRandomField();

    // Public Property

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
        for(var i = 1; i < 6; i++) {
            newfield.push([8, 2, 2, 2, 2]);
        }

        return newfield;
    }

    function slideVerticalOutLeft(m, inPanel) {
        var line = m - 1;

        var old = _.first(field[line], 4)
        field[line] = [inPanel];

        _.each(old, function(obj) {
             field[line].push(obj);
        });

        data = {
            SlideIn:  { type: inPanel, m: line, n:1 },
            SlideOut: { m: line, n:5 }
        }

        return new Action.Action("Slide", data);
    }

    function slideHorizontalOutTop(n, inPanel) {
        var line = n - 1;

        var input = inPanel;

        var newline = [ ]

        for(var i=0; i<5; i++) {
            newline.push(field[i][line]);
            field[i][line] = input;
            input = newline[i];
        }

        data = {
            SlideIn:  { type: inPanel, m: 1, n: line},
            SlideOut: { m: 5, n:line}
        }

        return new Action.Action("Slide", data);
    }

    function slideVerticalOutRight(m, inPanel) {
        var line = m - 1;
        field[line] = _.last(field[line], 4)
        field[line].push(inPanel);

        data = {
            SlideIn:  { type: inPanel, m: line, n:5 },
            SlideOut: { m: line, n:1 }
        }

        return new Action.Action("Slide", data);
    }

    function purgeColumn(inColumn) {

    }

    function purgeSpaces() {
        // Copy Down
        for(var column = 0; column < column.length; column++) {
            console.log("Purge column " + column);
            purgeColumn(column);
        } 
    }

    // Public Methode   
    this.slidePanelIn = function (m, n, newPanel) {
        if(n == 0) {
            return slideVerticalOutLeft(m, newPanel);
        } else if (m == 0) {
            return slideHorizontalOutTop(n, newPanel);
        } else if (n == 6) {
            return slideVerticalOutRight(m, newPanel);
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
        return field[m][n];
    }

    this.getColumn = function(inColumn) {
        var column = [];

        for(var i=0; i<5; i++) {
            column.push(field[i][inColumn]);
        }

        return column;
    }

    this.getRow = function(inRow) {
        var row = [];

        for(var i=0; i<5; i++) {
            row.push(field[inRow][i]);
        }

        return row;
    }

    return this;
}