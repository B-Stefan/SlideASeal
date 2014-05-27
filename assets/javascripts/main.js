require({
  urlArgs: "b=" + ((new Date()).getTime()),
  paths: {
    jquery: 'vendor/jquery/jquery',
    phaser: 'vendor/phaser/phaser',
    _: 'vendor/underscore/underscore'
  },
  shim: {
    phaser: {
      exports: 'Phaser'
    }
  }
});

define(['jquery', 'game'], function($) {});