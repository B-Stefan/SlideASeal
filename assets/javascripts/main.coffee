require
  urlArgs: "b=#{(new Date()).getTime()}"
  paths:
    jquery: 'vendor/jquery/jquery'
    Phaser: 'vendor/phaser/phaser'

  shim:
    phaser:
      exports: 'Phaser'


define ['jquery','app/Game'], ($)->

