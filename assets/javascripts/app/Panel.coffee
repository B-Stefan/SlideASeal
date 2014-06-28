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
    @getDefaultPanelBorder: ()-> 11


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

    setPosition: (row,col, border=Panel.getDefaultPanelBorder(), animation = false)=>
      @setRow(row)
      @setCol(col)
      bounds = @getBounds()
      newY =  row * (bounds.height + border)
      newX =  col * (bounds.width + border)
      if animation == false
        @y = newY
        @x = newX
      else
        return @game.add.tween(@).to({x:newX, y: newY}, 1000, Phaser.Easing.Quadratic.In, false, 0, false);


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


    show: ()=>
      @typeSprite.alpha = 1
      @backgroundSprite.alpha = 1
      #@game.add.tween(@typeSprite).to(alpha: 1, 200, Phaser.Easing.Quadratic.In,true);
      #@game.add.tween(@backgroundSprite).to(alpha: 1, 200, Phaser.Easing.Quadratic.In,true);


    slide: (direction)=>
      console.log("Slide=>", @getRow(),@getCol())
      if not direction of Panel.moveDirections
        throw new Error ("Please parse a Panel.moveDirection")

      switch  direction
        when Panel.moveDirections.DOWN  then position = Panel.moveDirections.TOP
        when Panel.moveDirections.LEFT  then position = Panel.moveDirections.LEFT
        when Panel.moveDirections.RIGHT then position = Panel.moveDirections.RIGHT
        when Panel.moveDirections.TOP   then position = Panel.moveDirections.DOWN

      neighbour = @getNeighbour(position)
      if neighbour != null
        neighbourTween = neighbour.slide(direction)
      else
        console.log("END")



      #Set Position
      switch  direction
        when Panel.moveDirections.DOWN    then tween = @setPosition(@getRow()+1  ,@getCol()   ,Panel.getDefaultPanelBorder(),true)
        when Panel.moveDirections.RIGHT   then tween = @setPosition(@getRow()    ,@getCol()+1 ,Panel.getDefaultPanelBorder(),true)
        when Panel.moveDirections.LEFT    then tween = @setPosition(@getRow()    ,@getCol()-1 ,Panel.getDefaultPanelBorder(),true)
        when Panel.moveDirections.TOP     then tween = @setPosition(@getRow()-1  ,@getCol()   ,Panel.getDefaultPanelBorder(),true)


      neighbourDown = @getNeighbour(Panel.moveDirections.DOWN)

      #If down is empty fall
      if neighbourDown == null and @getRow() != @parent.getSize()-1
        downTween = @slide(Panel.moveDirections.DOWN)
        if direction != Panel.moveDirections.DOWN
          tween.onComplete.add(()->
            downTween.start()
          ,@)
        else
          tween.onStart.add(()->
            downTween.start()
          ,@)

      tween.onComplete.add(()->
        #right or left
        if @parent != undefined
          if @getCol() == @parent.getSize() or @getCol() == -1 or @getRow() == @parent.getSize()
            killTween = @kill()
            killTween.start()

      ,@)
      if neighbourTween != undefined
        if direction != Panel.moveDirections.DOWN
          neighbourTween.onStart.add(()->
            tween.start()
          ,@)
          return neighbourTween
        else
          tween.onStart.add(()->
            neighbourTween.start()
          ,@)
          return tween
      else
        return tween



    kill: ()=>
      tween = @game.add.tween(@.scale).to({x: 0.001,y:0.001}, 300, Phaser.Easing.Quadratic.Out, false, 0, false);
      neighbour = @getNeighbour(Panel.moveDirections.TOP)
      tween.onComplete.add(()->
        @destroy()
      ,@)
      if neighbour != null
        neighbourTween = neighbour.slide(Panel.moveDirections.DOWN)
        tween.onStart.add(()->
          neighbourTween.start()
        ,@)
        neighbourTween
      return tween


    getNeighbour: (position)=>
      if not position of Panel.moveDirections
        throw new Error ("Please parse a Panel.moveDirection")

      result = null

      switch  position
        when Panel.moveDirections.DOWN    then result = @parent.getPanel(@getRow()+1  ,@getCol())
        when Panel.moveDirections.RIGHT   then result = @parent.getPanel(@getRow()    ,@getCol()+1)
        when Panel.moveDirections.LEFT    then result = @parent.getPanel(@getRow()    ,@getCol()-1)
        when Panel.moveDirections.TOP     then result = @parent.getPanel(@getRow()-1  ,@getCol())

      return result



    setRow: (row)=>
      @_SAS_row = row

    setCol: (col)=>
      @_SAS_col = col

    getRow:()=> @_SAS_row
    getCol: ()=> @_SAS_col

    setType:(type)=>
      @_SAS_type = type


    getType: ()=> @_SAS_type



