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
      TOP: 40
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


    constructor : (game,parent, type) ->
      if not type of Panel.types
        console.log("please parse one of the following type", Panel.types)


      super(game,0,0,'Panel_Background')#type.getName())

      @setType(type)

      @_SAS_col = 0
      @_SAS_row = 0

    setPosition: (row,col, border=0)=>
      console.log(border)
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



