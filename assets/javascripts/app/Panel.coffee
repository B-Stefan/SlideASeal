define ['Phaser', "jquery"], (Phaser, $)->

  class PanelType
    @baseUrl = '../../images/'
    @defaultExtention = '.svg'
    constructor: (name)->
      @name = name
    getName: ()=> @name
    getImageUrl: ()=>  PanelType.baseUrl + @name + PanelType.defaultExtention



  class Panel extends Phaser.Group
    # @static
    # @enum
    @types  = {
      FISH: new PanelType('FISH')
    }

    @loadAllTypes: (game)->
      for key,type of Panel.types
        game.load.image(type.getName(), type.getImageUrl())

      game.load.image("Panel_Background", PanelType.baseUrl + "Allubox.png")


    constructor : (game, type, x = 0 ,y = 0,frame) ->
      if not type of Panel.types
        console.log("please parse one of the following type", Panel.types)

      window.test = @
      super(game,null, type.getName()+'_GROUP',true,true,Phaser.Physics.ARCADE)
      @setType(type)

      @x =x
      @y =y

      @add(@getBackgroundSprite())
      @add(@getTypeSprite())

      @setAll('body.gravity.y', 100);
      @setAll('body.collideWorldBounds', true);


    getTypeSprite: ()=>
      if @_SAS_typeSprite == undefined
        @_SAS_typeSprite = @create(5,5,@getType().getName())
        @_SAS_typeSprite.scale.setTo(0.8,0.8)
      return @_SAS_typeSprite


    getBackgroundSprite: ()=>
      if @_SAS_backgroundSprite == undefined
        @_SAS_backgroundSprite = @create(0,0,"Panel_Background")
      return @_SAS_backgroundSprite

    setType:(type)=>
      @_SAS_type = type


    getType: ()=> @_SAS_type

