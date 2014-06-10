define ['Phaser', './Panel', 'network', './Player'], (Phaser,Panel, network,Player)->

  # The class for the field of panels / cards
  # @class Gamefield
  # @extend Phaser.Group
  class Gamefield extends Phaser.Group

    #Create an new Gamefield
    #@param {Phaser.Game} game
    #@param {int} [x=200] The x position
    #@param {int} [y=100] The y position
    constructor: (game, player, x = 200 , y = 100 )->
      if not player instanceof Player
        throw  new Error ("param player must a instance of Player class")

      super(game,null, 'GAME@FIELD',true,true)
      @x = x
      @y = y


      @_SAS_player = player
      @_SAS_panelToPlace = null;
      @_SAS_panelBorder = 10;
      @panelColiisionGroup =  @game.physics.p2.createCollisionGroup();
      #@enableBody = true;
      #@physicsBodyType = Phaser.Physics.P2JS;
      @_SAS_size = 0



    getCurrentPlayer: ()=>
    #Returns the player that sit in front of the gamefield
    getPlayer:()=> @_SAS_player

    #Get the size of the gamefield
    getSize: ()=> @_SAS_size

    #Create a default Gamefield
    #@param {Network.Field} field - The size of the gamefield
    createGamefield: (field)=>
      rowIndex = 0
      for row in  field
        colIndex = 0
        for panelTypeId in  row
          panelType = Panel.getTypeById(panelTypeId)
          @add(new Panel(@game,@,panelType),rowIndex,colIndex)
          colIndex = colIndex+1
        rowIndex=rowIndex+1
      @_SAS_size = rowIndex


    #Add the pannel to the group
    #@override
    #@param {Panel} panel - The Panel to add
    #@param {int} row the row to place the new panel
    #@param {int} col for the new Panel
    #@param {boolean} [animation=false] - if true a animation were played
    add: (panel, row, col, animation = false)=>
      if panel not instanceof Panel
        throw  new Error "Please set as argument an panel object"

      panel.setPosition(row,col, @getPanelBorder())

      #Animation
      if animation == true
        @slideNewPanelIn(row,col,panel)
      super(panel)


    #Return the row
    #@param {int} rowIndex - The index to get
    #@returns {Array<Panel>}  The row Array
    getRow: (rowIndex) =>
      row = []
      for panel in @children
        if panel.getRow() == rowIndex
          row.push(panel)
      return row

    #Returns the col
    #@param {int} colIndex - The col to get
    #@return {Array<Panel>} - The col as Array
    getCol: (colIndex) =>
      col = []
      for panel in @children
        if panel.getCol() == colIndex
          col.push(panel)
      return col

    #Reruns the place between 2 Panels
    #@returns {int} place between 2 Panels
    getPanelBorder:()=>@_SAS_panelBorder

    #Returns the Panel
    #@param {int} row
    #@param {int} col
    #@return {Panel} - The panel on the position (row,col)
    getPanel:(row, col)=>
      row = @getRow(row)
      for panel in row
        if panel.getCol() == col
          return panel
      return null

    #Set the 'Panel to place' this is the new Panel that the user can place
    #@param {Panel} newPanel - The new Panel to place
    setPanelToPlace: (newPanel)=>
      if not newPanel instanceof Panel
        throw new Error ("setPanelToPlace=> newPanel is not a instance of Panel")
      @_SAS_panelToPlace = newPanel

    #Get the current panel to place
    #@return {Panel|null} Panel or null if undefined
    getPanelToPlace: ()=> @_SAS_panelToPlace


    #Get the next position to the gamefield
    #@param {Panel} panelToCheckRelation  - The Panel to check
    #@return {object} Bounds
    #@example: returns {
    #  localLeft: 10
    #  localTop: 10
    #  width: 70
    #  height: 70
    #  col: 1
    #  row: 1
    #  position: 10
    #  left: 100
    #  right:200
    #}
    getNeighborBounds: (panelToCheckRelation)=>

      groupBounds = @getBounds();
      panelBounds = panelToCheckRelation.getBounds();
      relativeX = groupBounds.left - panelToCheckRelation.x - panelBounds.width/2
      relativeY = groupBounds.top - panelToCheckRelation.y - panelBounds.width/2
      position = null

      if panelToCheckRelation.x  > groupBounds.right
        position = Panel.moveDirections.RIGHT
      else if panelToCheckRelation.x < groupBounds.left
        position = Panel.moveDirections.LEFT
      else if panelToCheckRelation.y < groupBounds.top
        position = Panel.moveDirections.TOP

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

      ###
        console.log(col, relativeX/colWidth,relativeX,direction,groupBounds.width)
        console.log(row, relativeY/colWidth,relativeY,direction,groupBounds.height)
      ###
      panelBounds = panelToCheckRelation.getBounds()
      bounds = {
        localLeft: col* (panelBounds.width + @getPanelBorder())
        localTop: row* (panelBounds.height + @getPanelBorder())
        width: panelBounds.width
        height: panelBounds.height
        col: col
        row: row
        position: position
      }
      bounds.left = @x + bounds.localLeft
      bounds.top = @y + bounds.localTop

      return bounds

    #Slide the new Panel in and to the position rowIndex, colIndex
    #@param {int} rowIndex - The new Position index
    #@param {int} colIndex - The new Position index
    #@param {Panel} newPanel - The Panel to slide in
    #@param {Panel.moveDirections} - position - The current position of the newPanel

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


      #Get the lenght of the row/col
      if position == Panel.moveDirections.LEFT or position == Panel.moveDirections.RIGHT
        length = @getRow(rowIndex).length
      else if position == Panel.moveDirections.TOP
        length = @getCol(colIndex).length

      #Only slide if the size is maximum and the row/col is full
      console.log(@getRow(rowIndex),length,@getSize())
      if length == @getSize()
        @slide(rowIndex,colIndex,direction)

      @slidePanel(newPanel,direction)


    #Slide a complete row or col depend on the direction
    #@param {int} rowIndex - The row index to slide
    #@param {int} colIndex - The col index to slide
    #@param {Panel.moveDirection} direction - The direction to slide the row, col
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

    #Slide a singel Panel
    #@param {Panel} panel - the new Panel
    #@param {Panel.moveDirections} direction - The direction to slide the Panel
    slidePanel: (panel,direction) =>
      if direction of Panel.moveDirections
        throw  new Error("Please use a type of " + Panel.moveDirections + " but you use " + direction)

      dim   =   panel.getBounds()
      newX  =   panel.x
      newY =    panel.y

      switch direction
        when Panel.moveDirections.LEFT
          newX = newX-(dim.width   + @getPanelBorder())
          panel.setCol(panel.getCol()-1)

        when Panel.moveDirections.RIGHT
          newX = newX+(dim.width   + @getPanelBorder())
          panel.setCol(panel.getCol()+1)

        when Panel.moveDirections.DOWN
          newY = newY+(dim.width   + @getPanelBorder())
          panel.setRow(panel.getRow()+1)


      @game.add.tween(panel).to({x:newX, y: newY}, 1000, Phaser.Easing.Quadratic.In, true, 0, false);


    #Slide multiple Panels in one direction
    #IMPORTANT: The Last item on the array were killed after the animation ends
    #@param {Array<Panel>} panels - A Array of panels to slide
    #@param {Panel.moveDirections} direction - The direction to slide
    #@return {Phaser.Tween} The last tween of the animation queue
    slidePanels:(panels, direction)=>
      tween = ()-> throw  new Error "No Last Tween set"

      if direction == Panel.moveDirections.DOWN
        lastPanel = panels[panels.length-1]

        lastPanel.forEach((sprite)->
          tween = @game.add.tween(sprite.scale).to({x: 0.001,y:0.001}, 100, Phaser.Easing.Quadratic.Out, true, 0, false);
        ,@)
        tween.onComplete.add(()->
          @remove(lastPanel)
        ,@)
        panels.removeByValue(lastPanel)

      for panel in panels
        tween = @slidePanel(panel,direction)

      if direction == Panel.moveDirections.LEFT or direction == Panel.moveDirections.RIGHT
        velocity = 250
        if direction == Panel.moveDirections.LEFT
          velocity = velocity *-1

        tween.onComplete.add(
            (panel)->
              @game.physics.p2.enable(panel)
              panel.setAll('body.gravity.y', 300)
              panel.setAll('body.velocity.x',velocity)
              panel.outOfBoundsKill = true;

          ,@)
      return tween


    #Kill a singel panel and animate the move above
    #@param {Panel} panelToKill - The Panel to kill
    #@return {Phaser.Tween} the last Tween of the slidePanels action
    killPanel: (panelToKIll)=>
      panelsToSlide = []

      if panelToKIll.getRow() == 0
        return
      col  = @getCol(panelToKIll.getCol())
      for panel in col
        if panel.getRow() < panelToKIll.getRow()
          panelsToSlide.push(panel)
        else
          break


      panelsToSlide.push(panelToKIll)
      @slidePanels(panelsToSlide,Panel.moveDirections.DOWN)


    #Update function of the Gamefield
    #@override
    update: ()=>

      #Update the psotion of the newPanel that the user can move around the gamefield
      #Only if the you on the turn
      if @game.getCurrentPlayer() != null
        if @game.getCurrentPlayer().getSessionId() == @getPlayer().getSessionId
          @updatePanelToPlaceFollowMouse()

      super();

    #Update the position of the new panel that the user can place in the field
    #called from the update function
    #@return void
    updatePanelToPlaceFollowMouse: ()=>
      panelToUpdatePosition = @getPanelToPlace()
      if panelToUpdatePosition != null

        boundsGorup = @getBounds()
        x = @game.input.mousePointer.x;
        y = @game.input.mousePointer.y;
        #console.log(boundsGorup.top, y)


        #if the mouse pointer is above the bottom
        if boundsGorup.bottom > y
          #Check right or left corridor

          if (boundsGorup.top-100 < y and  boundsGorup.top > y) or ((boundsGorup.left-100 < x and boundsGorup.left > x ) or  (boundsGorup.right+100 > x and boundsGorup.right < x))
            #Gamefield hat ein neues Panel zum plazieren => Maus folgen

            panelToUpdatePosition.x = @game.input.mousePointer.x;
            panelToUpdatePosition.y = @game.input.mousePointer.y;
            neighborBounds = @getNeighborBounds(panelToUpdatePosition)


            switch neighborBounds.position
              when Panel.moveDirections.LEFT
                panelToUpdatePosition.x = neighborBounds.left - (neighborBounds.width + @getPanelBorder())
                panelToUpdatePosition.y = neighborBounds.top
              when Panel.moveDirections.RIGHT
                panelToUpdatePosition.x = neighborBounds.left + (neighborBounds.width  + @getPanelBorder())
                panelToUpdatePosition.y = neighborBounds.top
              when Panel.moveDirections.TOP
                panelToUpdatePosition.x = neighborBounds.left
                panelToUpdatePosition.y = neighborBounds.top - (neighborBounds.height  + @getPanelBorder())

            #set click state to down
            if @game.input.mousePointer.isDown
              if @SAS_TEMP_CLICK_DOWN == false or @SAS_TEMP_CLICK_DOWN == undefined
                @SAS_TEMP_CLICK_DOWN = true

            if @game.input.mousePointer.isUp
              #Clieck released
              if @SAS_TEMP_CLICK_DOWN
                @SAS_TEMP_CLICK_DOWN = false
                @setPanelToPlace(null)

                #Translate the into mN cords
                mN = @translateToNetworkRowCol(neighborBounds.row,neighborBounds.col, neighborBounds.position)
                network.slide(mN.m, mN.n);

    #Handle a single networkk action
    #@param {Action} action - The action to handle
    #@return {Phaser.Tween} The tween object
    handleNetworkAction: (action)=>

      if action.type == "Slide"
        if data.SlideIn
          trans =@translateFromNetworkRowCol(data.SlideIn.m,data.SlideIn.n)
          tween = @slideNewPanelIn(trans.row,trans.col,@getPanelToPlace(),trans.position)
          console.log("SlideAction",trans)
          alert("YEES hab eine SlideInAction bekommen")
          return tween
        else
          throw new Error "SlideAction must contain the SlideIn property"
      else if action.type == "Score"
        alert("YEES hab eine ScoreAction bekommen")
        console.log("ScroreAction")
      else
        console.log("HandleNetworkAction=> Action", action)
        throw new Error("HandleNetworkAction=> Unhandled Action: " + action.type)

    #Handle the response of the network
    #@param {array<Action>} actions  A Array of actions
    handleNetworkActions: (actions)=>
      for action in actions
        @handleNetworkAction(action)

    #Translate the row col index into a server side index
    #@param {int} row - The local col
    #@param {int} col - The local row
    #@param {Panel.moveDirections} position - The Position to slide in
    #@return {object} A simple object like: {m: 1, n:8}
    translateToNetworkRowCol:(row,col,position)=>
      console.log("translateToNetworkRowCol", arguments)
      if position == Panel.moveDirections.LEFT
        m = row+1
        n = 0
      else if position == Panel.moveDirections.RIGHT
        m = row+1
        n = @getSize()+1
      else if position == Panel.moveDirections.TOP
        m = 0
        n = col+1

      console.log(m,n)
      return {
        m: m
        n: n
      }

    #Translate the network m, n into row col,direction combination
    #@param {int} m - The network col
    #@param {int} n - The network row
    #@return {object} A simple object like: {row: 1, col:8, position: Panel.moveDirections.LEFt}
    translateFromNetworkRowCol: (m,n)->
      if n == 0
        position = Panel.moveDirections.LEFT
        col = 0
        row = m-1
      else if n == @getSize()+1
        position = Panel.moveDirections.RIGHT
        col = n-1
        row = m-1
      else if m == 0
        position = Panel.moveDirections.TOP
        row = 0
        col = n-1

      return {
        row: row
        col: col
        position: position
      }


    placeNewPanel:()=>
    testFunction: ()=>
      panel = new Panel(@game,null,Panel.types.FISH)
      panel.x = 100
      panel.y = 300
      @game.add.existing(panel);



      @setPanelToPlace(panel)
      #@add(new Panel(@game,@,Panel.types.FISH),1,1, true)


    testKill:(row, col)=>
      panelToKill = @getPanel(row,col)
      @killPanel(panelToKill)

