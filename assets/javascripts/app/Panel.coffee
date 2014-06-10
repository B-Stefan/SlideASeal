define ['Phaser', "jquery"], (Phaser, $)->

  class PanelType
    @baseUrl = './images/panels/'
    @defaultExtention = '.svg'
    constructor: (name)->
      @name = name
    getName: ()=> @name
    getImageUrl: ()=>  PanelType.baseUrl + @name + PanelType.defaultExtention


  class Panel extends Phaser.Group


    # @static
    # @enum
    @moveDirections = {
      LEFT: 10
      RIGHT: 20
      DOWN: 30
      TOP: 40
    }

    #@static
    #@desc: Reutrns a random type
    @getRandomType:() ->
      values = []
      for key, value of Panel.types
        values.push(value)

      randomType = values[Math.floor(Math.random() * values.length)]
      return randomType
    # @static
    # @enum
    @types  = {
      BALL: new PanelType('BALL')
      FISH: new PanelType('FISH')
      ANCHOR: new PanelType('ANCHOR')

    }

    @loadAllTypes: (game)->

      for key,type of Panel.types
        game.load.image(type.getName(), type.getImageUrl())

      game.load.image("Panel_Background", PanelType.baseUrl + "Allubox.png")


    constructor : (game,parent, type) ->
      if not type of Panel.types
        console.log("please parse one of the following type", Panel.types)


      super(game,parent,'PANEL_GROUP',true)#type.getName())


      @backgroundSprite = @create(0,0, 'Panel_Background')
      @typeSprite = @create(0,0, type.getName())

      #Set Anchor to middel
      @backgroundSprite.anchor.setTo(0.5,0.5)
      @typeSprite.anchor.setTo(0.5,0.5)

      #Correct anchor
      @backgroundSprite.x = @backgroundSprite.getBounds().height/2
      @backgroundSprite.y = @backgroundSprite.getBounds().width/2

      #Correct anchor and scale
      @typeSprite.x = @typeSprite.getBounds().height/2
      @typeSprite.y = @typeSprite.getBounds().width/2
      @typeSprite.scale.setTo(0.8,0.8)


      @setType(type)

      @_SAS_col = 0
      @_SAS_row = 0

    setPosition: (row,col, border=0)=>
      @setRow(row)
      @setCol(col)
      bounds = @getBounds()
      @y = row * (bounds.height + border)
      @x = col * (bounds.width + border)

      #super(x,y)

    setRow: (row)=>
      @_SAS_row = row

    setCol: (col)=>
      @_SAS_col = col

    getRow:()=> @_SAS_row
    getCol: ()=> @_SAS_col

    setType:(type)=>
      @_SAS_type = type


    getType: ()=> @_SAS_type



