_ = require('underscore');


exports.createField = function () {
	// Private Property;
    //var bla = 1;

    // Public Property
    this.id = "0";
    this.field = [];

    // Private Methode
    function getRandom(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // Public Methode
    for(var i = 0; i < 5; i++) {
        this.field.push([getRandom(1, 7), getRandom(1, 7), getRandom(1, 7), getRandom(1, 7), getRandom(1, 7)]);
    }

    return this;
}