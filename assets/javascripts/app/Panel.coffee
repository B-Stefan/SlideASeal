define ['Phaser', "jquery"], (Phaser, $)->

  class PanelType
    @baseUrl = "//"+ window.location.host + '/images/panels/'
    @defaultExtention = '.png'
    constructor: (name,id)->
      @name = name
      @id = id
    getName: ()=> @name
    getId: ()=> @id
    getImageUrl: ()=>  PanelType.baseUrl + @name + PanelType.defaultExtention


  class Panel extends Phaser.Group


    # @static
    # Default border between 2 Panels on the Gamefield and UpcomingPanelBoad
    @getDefaultPanelBorder: ()-> 10


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
    @getTypeRandom:() ->
      values = []
      for key, value of Panel.types
        values.push(value)

      randomType = values[Math.floor(Math.random() * values.length)]
      return randomType

    #@static
    #@desc: Returns the type with the id s
    #@return {Panel|null} the panel with the id
    @getTypeById:(id) ->
      for key, value of Panel.types
        if id == value.getId()
          return value
      return null

    # @static
    # @enum
    @types  = {
      ANCHOR:   new PanelType('ANCHOR',1)
      WHEEL:    new PanelType('WHEEL',2)
      LIFEBELT: new PanelType('LIFEBELT',3)
      FISH_REST:new PanelType('FISH_REST',4)
      BALL:     new PanelType('BALL',5)
      FISH:     new PanelType('FISH',6)
      BARREL:   new PanelType('BARREL',7)
    }

    @loadAllTypes: (game)->

      for key,type of Panel.types
        game.load.image(type.getName(), type.getImageUrl())

      game.load.image("Panel_Background", PanelType.baseUrl + "ALLUBOX.png")


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

      #Correct anchor and scale

      @typeSprite.scale.setTo(0.8,0.8)


      @setType(type)

      @_SAS_col = -1
      @_SAS_row = -1

    setPosition: (row,col, border=Panel.getDefaultPanelBorder())=>
      @setRow(row)
      @setCol(col)
      bounds = @getBounds()
      @y = row * (bounds.height + border)
      @x = col * (bounds.width + border)

    setPositionNeighbour:(row,col,position,anchorBounds,border = Panel.getDefaultPanelBorder())=>
      @setPosition(row,col,border)
      if not position of Panel.moveDirections
        throw new Error "Please parse a moveDirection as Positoin "

      if anchorBounds == undefined
        anchorBounds = @parent.getBounds()
      if anchorBounds != null
        @x = @x + anchorBounds.left
        @y = @y + anchorBounds.top



      selfBounds = @getBounds()

      @x = @x + selfBounds.width/2
      @y = @y + selfBounds.height/2
      #console.log("XY",@x,@y, row,col,position,anchorBounds,@parent)
      switch position
        when Panel.moveDirections.LEFT
          @x = @x  - selfBounds.width - border
        when Panel.moveDirections.RIGHT
          @x = @x + selfBounds.width + border
        when Panel.moveDirections.TOP
          @y = @y - selfBounds.height - border

    setRow: (row)=>
      @_SAS_row = row

    setCol: (col)=>
      @_SAS_col = col

    getRow:()=> @_SAS_row
    getCol: ()=> @_SAS_col

    setType:(type)=>
      @_SAS_type = type


    getType: ()=> @_SAS_type



