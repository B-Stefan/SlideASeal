require
  urlArgs: "b=#{(new Date()).getTime()}"
  paths:
    jquery: 'vendor/jquery/jquery'


define ['jquery'], ($)->
  alert("Test")