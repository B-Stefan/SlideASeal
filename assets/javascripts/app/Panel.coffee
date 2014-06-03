define ['Phaser', "jquery"], (Phaser, $)->

  class PanelType
    @baseUrl = '../../images/'
    @defaultExtention = '.svg'
    constructor: (name)->
      @name = name
    getName: ()=> @name
    getImageUrl: ()=>  PanelType.baseUrl + @name + PanelType.defaultExtention




  class Panel extends Phaser.Sprite


    # @static
    # @enum
    @moveDirections = {
      LEFT: 10
      RIGHT: 20
      DOWN: 30
    }
    # @static
    # @enum
    @types  = {
      FISH: new PanelType('FISH')
    }

    @loadAllTypes: (game)->
      for key,type of Panel.types
        game.load.image(type.getName(), type.getImageUrl())

      game.load.image("Panel_Background", PanelType.baseUrl + "Allubox.png")


    constructor : (game,parent, type, x = 0 ,y = 0) ->
      if not type of Panel.types
        console.log("please parse one of the following type", Panel.types)

      super(game,x,y,'Panel_Background')#type.getName())
      @game.physics.p2.enable(@)
      @setType(type)
      @x =x
      @y =y



    setType:(type)=>
      @_SAS_type = type


    getType: ()=> @_SAS_type

    slide: (direction ) =>
      if direction of Panel.moveDirections
        throw  new Error("Please use a type of " + Panel.moveDirections + " but you use " + direction)

      dim = @.getBounds()
      switch direction
        when Panel.moveDirections.LEFT then @body.moveLeft(dim.width)
        when Panel.moveDirections.RIGHT then @body.moveRight(dim.width)
        when Panel.moveDirections.DOWN then alert("Not Implement")


      console.log(@.getBounds())

