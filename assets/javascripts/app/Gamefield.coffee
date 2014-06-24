define ['Phaser',
        '_',
        './Panel',
        'network',
        './Player',
        './Banner'],
(Phaser, _ ,Panel, network,Player, Banner)->




  # The class for the field of panels / cards
  # @class Gamefield
  # @extend Phaser.Group
  class Gamefield extends Phaser.Group


    # Load all files required for the gamefield
    # @static
    # @param {Phaser.Game} game the game with the loader, called from the prelaod function of the game
    @preload: (game)->
      game.load.image('Gamefield_bg',game.normalizeUrl('/Images/Gamefield_bg.png'));

    #Create an new Gamefield
    #@param {Phaser.Game} game
    #@param {int} [x=200] The x position
    #@param {int} [y=100] The y position
    constructor: (game, player, x = 225 , y = 150 )->
      if not player instanceof Player
        throw  new Error ("param player must a instance of Player class")

      super(game,game.world, 'GAME@FIELD',true,true)
      @x = x
      @y = y

      @_SAS_background = new Phaser.Sprite(game,@x-(@getPanelBorder()+68),@y-(@getPanelBorder()+68),'Gamefield_bg')
      @_SAS_background.width = @getBounds().width
      @_SAS_background.height = @getBounds().height
      @game.add.existing(@_SAS_background);
      @game.add.existing(@);
      @_SAS_player = player
      @_SAS_panelToPlace = null;
      @panelColiisionGroup =  @game.physics.p2.createCollisionGroup();
      #@enableBody = true;
      #@physicsBodyType = Phaser.Physics.P2JS;
      @_SAS_size = 0


    #Returns the background Panel
    getBackgroundPanel:()=> @_SAS_background

    #Returns the player that sit in front of the gamefield
    getPlayer:()=> @_SAS_player

    #Get the size of the gamefield
    getSize: ()=> @_SAS_size

    #Create a default Gamefield
    #@param {Network.Field} field - The size of the gamefield
    createGamefield: (field)=>
      #Create field
      rowIndex = 0
      for row in  field
        colIndex = 0
        for panelTypeId in  row
          panelType = Panel.getTypeById(panelTypeId)
          if panelTypeId !=0
            @add(new Panel(@game,@,panelType),rowIndex,colIndex)
          colIndex = colIndex+1
        rowIndex=rowIndex+1
      @_SAS_size = rowIndex

      @updateBackgroundSize(rowIndex,colIndex)



    updateBackgroundSize: (rowCount,colCount)=>
      #Set bg to size of the Gamefield (because resize)
      bg = @getBackgroundPanel()

      bg.x = @x - @getDefaultPanelBounds().width/2
      bg.y = @y - @getDefaultPanelBounds().height/2


      bg.width  = (@getDefaultPanelBounds().width+@getPanelBorder())* colCount
      bg.height = (@getDefaultPanelBounds().height+@getPanelBorder()) * rowCount

    #Add the pannel to the group
    #@override
    #@param {Panel} panel - The Panel to add
    #@param {int} row the row to place the new panel
    #@param {int} col for the new Panel
    #@param {boolean} [animation=false] - if true a animation were played
    #@param {Panel.moveDirections} [position=null] - if animation true we net the current position to calculate the direction
    add: (panel, row, col)=>
      if panel not instanceof Panel
        throw  new Error "Please set as argument an panel object"

      panel.setPosition(row,col, @getPanelBorder())
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
    getPanelBorder:()=> Panel.getDefaultPanelBorder()

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

      #if @_SAS_panelToPlace != null
        #@_SAS_panelToPlace.destroy()
      newPanel.x = 100
      newPanel.y = 100
      @game.add.existing(newPanel)
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

      groupBounds = @getBackgroundPanel().getBounds();
      panelBounds = panelToCheckRelation.getBounds();
      relativeX = groupBounds.left - panelToCheckRelation.x - panelBounds.width/2
      relativeY = groupBounds.top - panelToCheckRelation.y - panelBounds.height/2
      position = null

      if panelToCheckRelation.x  > groupBounds.right
        position = Panel.moveDirections.RIGHT
      else if panelToCheckRelation.x < groupBounds.left
        position = Panel.moveDirections.LEFT
      else if panelToCheckRelation.y < groupBounds.top
        position = Panel.moveDirections.TOP

      #Define col
      rowLength = parseInt(Math.abs(Math.round(groupBounds.height / (@getDefaultPanelBounds().height  + @getPanelBorder()))))
      relativeX = Math.abs(relativeX)
      colWidth =  groupBounds.width/rowLength
      col = Math.abs(Math.round(relativeX/colWidth))

      #Define row
      colLength = Math.abs(Math.round(groupBounds.width / (@getDefaultPanelBounds().width  + @getPanelBorder())))
      relativeY = Math.abs(relativeY)
      rowWidth =  groupBounds.width/colLength
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
      if row >= colLength
        row = colLength-1

      if col >= rowLength
        col = rowLength-1


      #console.log("SIZE", rowLength,colLength)
      #console.log('AUS:',groupBounds,panelBounds,relativeX,relativeY)
      #console.log('COL:',col, Math.abs(Math.round(relativeX/colWidth)),relativeX,position,groupBounds.width)
      #console.log('ROW',row, Math.abs(Math.round(relativeY/rowWidth)),position,groupBounds.height)

      bounds = {
        localLeft: col*(panelBounds.width + @getPanelBorder())
        localTop: row*(panelBounds.height + @getPanelBorder())
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
    #@param {Panel} newPanel - The Panel to slide in
    #@param {int} rowIndex - The new Position index
    #@param {int} colIndex - The new Position index
    #@param {Panel.moveDirections} - position - The current position of the newPanel

    slideNewPanelIn: (newPanel,rowIndex, colIndex, position)=>


      if position == Panel.moveDirections.LEFT
        newPanel.setCol(colIndex-1)
        newPanel.setRow(rowIndex)

      else if position == Panel.moveDirections.RIGHT
        newPanel.setCol(colIndex+1)
        newPanel.setRow(rowIndex)
      else if position == Panel.moveDirections.TOP
        newPanel.setCol(colIndex)
        newPanel.setRow(rowIndex-1)


      @add(newPanel,newPanel.getRow(),newPanel.getCol())
      switch  position
        when Panel.moveDirections.DOWN    then direction = Panel.moveDirections.TOP
        when Panel.moveDirections.RIGHT   then direction = Panel.moveDirections.LEFT
        when Panel.moveDirections.LEFT    then direction = Panel.moveDirections.RIGHT
        when Panel.moveDirections.TOP     then direction = Panel.moveDirections.DOWN


      if direction == Panel.moveDirections.DOWN and newPanel.getRow()  == -1
        col = @getCol(newPanel.getCol())
        #Only kill panel if the col is full
        if col.length == @getSize()+1
          lastPanelInCol = @getPanel(@getSize()-1,newPanel.getCol())
          tween = lastPanelInCol.kill()
          tween.start()
          return tween

      return @slidePanel(newPanel,direction)



    #Slide a singel Panel
    #@param {Panel} panel - the new Panel
    #@param {Panel.moveDirections} direction - The direction to slide the Panel
    slidePanel: (panel,direction) =>
     tween = panel.slide(direction)

     tween.start()
     return tween



    #Kill a singel panel and animate the move above
    #@param {Panel} panelToKill - The Panel to kill
    #@return {Phaser.Tween} the last Tween of the slidePanels action
    killPanel: (panelToKIll)=>
      tween = panelToKIll.kill()
      tween.start()
      return tween

    #Check if it is your turn
    #@return {boolean}
    yourTurn: ()=>
      if @game.getCurrentPlayer() != null
        if @game.getCurrentPlayer().getSessionId() == @getPlayer().getSessionId()
          return true
      return false


    #Update function of the Gamefield
    #@override
    update: ()=>

      #Update the psotion of the newPanel that the user can move around the gamefield
      #Only if the you on the turn

      if @yourTurn()
        @updatePanelToPlaceFollowMouse()

      super();

    #Update the position of the new panel that the user can place in the field
    #called from the update function
    #@return void
    updatePanelToPlaceFollowMouse: ()=>
      panelToUpdatePosition = @getPanelToPlace()
      if panelToUpdatePosition != null

        boundsGroup = @getBackgroundPanel().getBounds()
        x = @game.input.mousePointer.x;
        y = @game.input.mousePointer.y;
        #console.log(boundsGorup.top, y)


        #if the mouse pointer is above the bottom
        if boundsGroup.bottom > y
          #Check right or left corridor

          if (boundsGroup.top-100 < y and  boundsGroup.top > y) or ((boundsGroup.left-100 < x and boundsGroup.left > x ) or  (boundsGroup.right+100 > x and boundsGroup.right < x))
            #Gamefield hat ein neues Panel zum plazieren => Maus folgen



            panelToUpdatePosition.x = @game.input.mousePointer.x;
            panelToUpdatePosition.y = @game.input.mousePointer.y;
            neighborBounds = @getNeighborBounds(panelToUpdatePosition)
            if panelToUpdatePosition.getRow() != neighborBounds.row or panelToUpdatePosition.getCol() != neighborBounds.col
              mN = @translateToNetworkRowCol(neighborBounds.row,neighborBounds.col, neighborBounds.position)
              network.sendSlidePostion(mN.m, mN.n);

            panelToUpdatePosition.setPositionNeighbour(neighborBounds.row,neighborBounds.col,neighborBounds.position,@getBackgroundPanel().getBounds())



            #set click state to down
            if @game.input.mousePointer.isDown
              if @SAS_TEMP_CLICK_DOWN == false or @SAS_TEMP_CLICK_DOWN == undefined
                @SAS_TEMP_CLICK_DOWN = true

            if @game.input.mousePointer.isUp
              #Clieck released
              if @SAS_TEMP_CLICK_DOWN
                @SAS_TEMP_CLICK_DOWN = false
                #Translate the into mN cords
                mN = @translateToNetworkRowCol(neighborBounds.row,neighborBounds.col, neighborBounds.position)
                network.slide(mN.m, mN.n);

    #Handle a single networkk action
    #@param {Action} action - The action to handle
    #@return {Phaser.Tween | null} The tween object or null if no tween created
    handleNetworkAction: (action)=>
     if action.type == "Slide"
        if action.data.SlideIn
          trans =@translateFromNetworkRowCol(action.data.SlideIn.m,action.data.SlideIn.n,action.data.SlideIn.orientation)
          tween = @slideNewPanelIn(@getPanelToPlace(),trans.row,trans.col,trans.position)
          console.log("SlideAction",trans)
          return tween
        else
          throw new Error "SlideAction must contain the SlideIn property"
      else if action.type == "Score"

        if action.data.Score.count == 3
          Banner.play('three-of-a-kind')

        if action.data.Score.count == 4
          Banner.play('four-of-a-kind')

        if action.data.Score.count == 5
          Banner.play('five-of-a-kind')

        numberOfPanels = action.data.Score.count
        trans = @translateFromNetworkRowCol(action.data.Score.m,action.data.Score.n,action.data.Score.orientation)
        i = 0
        while i != numberOfPanels
          if trans.position == Panel.moveDirections.LEFT or trans.position == Panel.moveDirections.RIGHT
            panel = @getPanel(trans.row,trans.col+i)
          else if trans.position == Panel.moveDirections.TOP
            panel = @getPanel(trans.row+i,trans.col)
          i = i+1
          tween = @killPanel(panel)

        return tween


      else
        console.log("HandleNetworkAction=> Action", action)
        throw new Error("HandleNetworkAction=> Unhandled Action: " + action.type)


    handleNetworkGameState: (gameState)=>
      #setCurrent player
      @game.setCurrentPlayer(new Player(gameState.currentPlayer,gameState.currentPlayer))

      #If actions in the gamestate
      if gameState.actions.length > 0
        lastTween = @handleNetworkActions(gameState.actions)

        if lastTween != null and lastTween != undefined
          lastTween.onComplete.add(()->
            console.log("")
            #@repaintGamefield(gameState.field)
          ,@)
        else
          throw new Error ("handleNetworkGameState=> @handleNetworkActions must return a Phaser.Tween ")

    #Handle all messages from the Server
    handleNetworkNotification: (message)=>
      if message.msg == "a player leave the game"
        panelToPlace = @getPanelToPlace()
        panelToPlace.destroy()
        @setPanelToPlace(null)


    #Handle the response of the network
    #@param {array<Action>} actions  A Array of actions
    #@return {Phaser.Tween|null} returns the last tween or if actions.length == 0 null
    handleNetworkActions: (actions)=>
      self = @
      if actions.length == 0
        return



      tween = null
      actionToCall = actions[0]
      nextAction =  () ->
        actions.removeByValue(actionToCall)
        console.log("ACTION START")
        tween = self.handleNetworkAction(actionToCall)
        if actions.length > 0
          actionToCall = actions[0]
          if tween != null
            tween.onComplete.add(()->
              console.log("ACTION FINSCHED ")
              nextAction()
            ,@)

          else
            console.log("handleNetworkActions=> Action return no tween ! ")
        else
          console.log("ACTION FINCHED(ALL)")
      nextAction()

      return tween

    #Handle the update of the other players slide position
    handleNetworkSlideNewPanelPosition: (slidePositionUpdate)=>
      if @yourTurn()
        return

      trans = @translateFromNetworkRowCol(slidePositionUpdate.m,slidePositionUpdate.n)
      #console.log("handleNetworkSlideNewPanelPosition", slidePositionUpdate,trans)
      panelToPlace = @getPanelToPlace()
      if panelToPlace == null or panelToPlace == undefined
        throw new Error ("Panel to place cant be null or undefined")

      panelToPlace.setPositionNeighbour(trans.row,trans.col,trans.position,@getBackgroundPanel().getBounds())

    repaintGamefield: (field)=>
      @removeAll(true)
      @createGamefield(field)

    #Translate the row col index into a server side index
    #@param {int} row - The local col
    #@param {int} col - The local row
    #@param {Panel.moveDirections} position - The Position to slide in
    #@return {object} A simple object like: {m: 1, n:8}
    translateToNetworkRowCol:(row,col,position)=>
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
    translateFromNetworkRowCol: (m,n,orientation = null)=>
      if n == 0
        position = Panel.moveDirections.LEFT
        col = 0
        row = m-1
      else if n == @getSize()+1
        position = Panel.moveDirections.RIGHT
        col = n-2
        row = m-1
      else if m == 0
        position = Panel.moveDirections.TOP
        row = 0
        col = n-1
      else
        row = m-1
        col = n-1

      if orientation != null and position == undefined
        if orientation == 'vertical'
          position = Panel.moveDirections.TOP
        else if orientation == 'horizontal'
          if col == 0
            position = Panel.moveDirections.LEFT
          else if col ==  @getSize()-1
            position = Panel.moveDirections.RIGHT
          else
            position = Panel.moveDirections.RIGHT

      if row == undefined  or col == undefined  or position == undefined
        throw new Error ("Unknown input")

      return {
        row: row
        col: col
        position: position
      }


    getDefaultPanelBounds:()=>
      if @children.length > 0
        return @children[0].getBounds()
      else
        return {
          left: 0
          top: 0
          width: 0
          height: 0
        }


    testKill:(row, col)=>
      panelToKill = @getPanel(row,col)
      @killPanel(panelToKill)

