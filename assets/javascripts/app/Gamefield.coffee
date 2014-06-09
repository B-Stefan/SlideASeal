define ['Phaser', './Panel'], (Phaser,Panel)->
  class Gamefield extends Phaser.Group


    constructor: (game, size, x = 200 , y = 100 )->
      super(game,null, 'GAME@FIELD',true,true)
      @x = x
      @y = y

      @_SAS_panelToPlace = null;
      @_SAS_panelBorder = 10;
      @panelColiisionGroup =  @game.physics.p2.createCollisionGroup();
      #@enableBody = true;
      #@physicsBodyType = Phaser.Physics.P2JS;
      @createGamefield(size)



    createGamefield: (size)=>
      for row in [0..size]
        for col in  [0..size]
          @add(new Panel(@game,@,Panel.types.FISH),row,col)


    add: (panel, row, col, animation = false)=>
      if panel not instanceof Panel
        throw  new Error "Please set as argument an panel object"

      panel.setPosition(row,col, @getPanelBorder())
      super(panel)

      #Animation
      if animation == true
        @slideNewPanelIn(row,col,panel)


    getRow: (rowIndex) =>
      row = []
      for panel in @children
        if panel.getRow() == rowIndex
          row.push(panel)
      return row

    getCol: (colIndex) =>
      col = []
      for panel in @children
        if panel.getCol() == colIndex
          col.push(panel)
      return col

    getPanelBorder:()=>@_SAS_panelBorder
    getPanel:(row, col)=>
      row = @getRow(row)
      for panel in row
        if panel.getCol() == col
          return panel
      return null

    setPanelToPlace: (newPanel)=>
      if not newPanel instanceof Panel
        throw new Error ("setPanelToPlace=> newPanel is not a instance of Panel")
      @_SAS_panelToPlace = newPanel

    getPanelToPlace: ()=> @_SAS_panelToPlace


    getNeighbor: (panelToCheckRelation)=>

      groupBounds = @getBounds();
      panelBounds = panelToCheckRelation.getBounds();
      relativeX = groupBounds.left - panelToCheckRelation.x - panelBounds.width/2
      relativeY = groupBounds.top - panelToCheckRelation.y - panelBounds.width/2
      direction = null

      if panelToCheckRelation.x  > groupBounds.right
        direction = Panel.moveDirections.RIGHT
      else if panelToCheckRelation.x < groupBounds.left
        direction = Panel.moveDirections.LEFT
      else if panelToCheckRelation.y < groupBounds.top
        direction = Panel.moveDirections.TOP

      firstRow = @getRow(0)
      relativeX = Math.abs(relativeX)
      colWidth =  groupBounds.width/firstRow.length
      col = Math.abs(Math.round(relativeX/colWidth))

      firstCol = @getCol(0)
      relativeY = Math.abs(relativeY)
      rowWidth =  groupBounds.width/firstCol.length
      row = Math.abs(Math.round(relativeY/rowWidth))

      #Korrektur der Indexies (kleiner als 0 => 0 alle anderen -1 )
      if row > 0
        row = row-1
      else
        row = 0
      if col > 0
        col = col-1
      else
        col = 0

      #Korrektur bei > als lenght
      if row >= firstCol.length
        row = firstCol.length-1

      if col >= firstRow.length
        col = firstRow.length-1

      panel = @getPanel(row,col)
      if panel == null
        console.log(col, relativeX/colWidth,relativeX,direction,groupBounds.width)
        console.log(row, relativeY/colWidth,relativeY,direction,groupBounds.height)
        throw new Error ("Cant find panel ")
      return {
        panel:@getPanel(row,col)
        direction: direction
      }

    slideNewPanelIn: (rowIndex, colIndex, newPanel, position)=>

      ###
          COL: 0   1   2   ..
      ROW: 0 | P1| P2| P3| P4| 5 | Game.js:84
           1 |---|---|---|---|---| Game.js:85
           2 | 6 | 7 | 8 | 9 | 10| Game.js:84
           3 |---|---|---|---|---| Game.js:85
      ###

      #Slide in on the left side Position 1 and 6
      #Slide in from left
      if position == Panel.moveDirections.LEFT
        direction = Panel.moveDirections.RIGHT

      #Slide in on the right side Position  5 or 10
      #Slide in from right
      else if  position == Panel.moveDirections.RIGHT
        direction = Panel.moveDirections.LEFT

      #Sliden in from top position 1 2 3 4 5
      #Slide other down
      else if  position == Panel.moveDirections.TOP
        direction = Panel.moveDirections.DOWN
      else
        throw  new Error (["slideNewPanelIn=> Unexpected Input: RowIndex: "+ rowIndex+" colIndex: "+colIndex, ] )


      @slide(rowIndex,colIndex,direction)
      @slidePanel(newPanel,direction)


    slide: (rowIndex,colIndex,direction)=>
      ###
       | 1 | 2 | 3 | 4 | 5 | Game.js:84
       |---|---|---|---|---| Game.js:85
       | 6 | 7 | 8 | 9 | 10| Game.js:84
       |---|---|---|---|---| Game.js:85
      ###
      if direction ==  Panel.moveDirections.DOWN
        panels = @getCol(colIndex)
      else
        panels = @getRow(rowIndex)
        #Umsortieren, da immer das letzte element entfernt wird
        if direction == Panel.moveDirections.LEFT
          panels = panels.reverse()


      @slidePanels(panels,direction)

    slidePanel: (panel,direction) =>
      if direction of Panel.moveDirections
        throw  new Error("Please use a type of " + Panel.moveDirections + " but you use " + direction)

      dim   =   panel.getBounds()
      newX  =   panel.x
      newY =    panel.y

      console.log(panel)
      switch direction
        when Panel.moveDirections.LEFT  then newX = newX-(dim.width   + @getPanelBorder())
        when Panel.moveDirections.RIGHT then newX = newX+(dim.width   + @getPanelBorder())
        when Panel.moveDirections.DOWN  then newY = newY+(dim.width   + @getPanelBorder())

      @game.add.tween(panel).to({x:newX, y: newY}, 1000, Phaser.Easing.Quadratic.Out, true, 0, false);

    slidePanels:(panels, direction)=>
      lastTween = ()-> throw  new Error "No Last Tween set"

      for panel in panels
          lastTween = @slidePanel(panel,direction)

      if direction == Panel.moveDirections.LEFT or direction == Panel.moveDirections.RIGHT
        velocity = 100
        if direction == Panel.moveDirections.LEFT
          velocity = velocity *-1

        lastTween.onComplete.add(
            (panel)->
              @game.physics.p2.enable(panel)
              panel.body.gravity.y = 300
              panel.body.velocity.x = velocity
              #@remove(panel,true)
          ,@)

      else if direction == Panel.moveDirections.DOWN
        lastTween.onComplete.add(
          (panel)->
            panel.destroy()
            @remove(panel,true)

        ,@)
      else
        throw Error ("Wrong direct your direction is "+direction)


    update: ()=>
      panelToUpdatePosition = @getPanelToPlace()
      if panelToUpdatePosition != null

        boundsGorup = @getBounds()
        x = @game.input.mousePointer.x;
        y = @game.input.mousePointer.y;
        #console.log(boundsGorup.top, y)


        #if the mouse pointer is above the bottom
        if boundsGorup.bottom > y
          #Check right or left corridor
          if (boundsGorup.top-80 < y and  boundsGorup.top > y) or ((boundsGorup.left-100 < x and boundsGorup.left > x ) or  (boundsGorup.right+100 > x and boundsGorup.right < x))
              #Gamefield hat ein neues Panel zum plazieren => Maus folgen

              panelToUpdatePosition.x = @game.input.mousePointer.x;
              panelToUpdatePosition.y = @game.input.mousePointer.y;
              neighbor = @getNeighbor(panelToUpdatePosition)
              neighborBounds = neighbor.panel.getBounds()
              switch neighbor.direction
                when Panel.moveDirections.LEFT
                  panelToUpdatePosition.x = neighborBounds.left - (neighborBounds.width + @getPanelBorder())
                  panelToUpdatePosition.y = neighborBounds.top
                when Panel.moveDirections.RIGHT
                  panelToUpdatePosition.x = neighborBounds.left + (neighborBounds.width  + @getPanelBorder())
                  panelToUpdatePosition.y = neighborBounds.top
                when Panel.moveDirections.TOP
                  panelToUpdatePosition.x = neighborBounds.left
                  panelToUpdatePosition.y = neighborBounds.top - (neighborBounds.height  + @getPanelBorder())

              if @game.input.mousePointer.isDown
                  if @SAS_TEMP_CLICK_DOWN == false or @SAS_TEMP_CLICK_DOWN == undefined
                    @SAS_TEMP_CLICK_DOWN = true

              if @game.input.mousePointer.isUp
                  if @SAS_TEMP_CLICK_DOWN
                    @SAS_TEMP_CLICK_DOWN = false
                    @setPanelToPlace(null)
                    @slideNewPanelIn(neighbor.panel.getRow(),neighbor.panel.getCol(),panelToUpdatePosition, neighbor.direction)

      super();

    testFunction: ()=>
      panel = new Panel(@game,null,Panel.types.FISH)
      panel.x = 100
      panel.y = 300
      #panel.anchor.setTo(0.5,0.5)
      @game.add.existing(panel);
      neighbor = @getNeighbor(panel)

      @setPanelToPlace(panel)
      #@add(new Panel(@game,@,Panel.types.FISH),1,1, true)


