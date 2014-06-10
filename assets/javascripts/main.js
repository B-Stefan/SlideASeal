require({
  //urlArgs: "b=" + ((new Date()).getTime()),
  paths: {
    jquery: 'vendor/jquery/jquery',
    Phaser: 'vendor/phaser/phaser',
    _: 'vendor/underscore/underscore'
  },
  shim: {
    Phaser: {
      exports: 'Phaser'
    }
  }
});

define(['jquery', 'app/Game'], function($) {

    Array.prototype.removeByValue = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    }

});