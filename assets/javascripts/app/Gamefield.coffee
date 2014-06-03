define ['Phaser', './Panel'], (Phaser,Panel)->
  class Gamefield extends Phaser.Group

    constructor: (game)->
      super(game,null, 'GAME@FIELD',true,true)

      for i in [1..5]
        @add(new Panel(@game,@,Panel.types.FISH, i*69,40))

      for i in [1..5]
        @add(new Panel(@game,@,Panel.types.FISH, i*69,100))


    add: (panel )=>
      if panel not instanceof Panel
        throw  new Error "Please set as argument an panel object"
      super(panel)


    getPanel: (index) => @children[index]
    slidePanel:(panel,direction) =>
      if not panel instanceof Panel
        throw new Error("Please parse a panel")
      panel.slide(direction)


    testSlide: ()=>
      panel = @getPanel(1)
      panel.slide(Panel.moveDirections.LEFT)

