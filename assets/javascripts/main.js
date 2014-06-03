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

define(['jquery', 'app/Game'], function($) {});