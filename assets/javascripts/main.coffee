require
  urlArgs: "b=#{(new Date()).getTime()}"
  paths:
    jquery: 'vendor/jquery/jquery'
    phaser: 'vendor/phaser/phaser'

  shim:
    phaser:
      exports: 'Phaser'


define ['jquery','Game'], ($)->
