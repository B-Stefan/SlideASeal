define ['Phaser', './Panel'], (Phaser,Panel)->

  #Class create a Board on the right side to show the new Panels
  #@see Panel
  class UpcommingPanelsBoard extends Phaser.Group

    #@static
    #Load all required sprites and so
    @preload: (game)->
      console.log('')



    #Crate a new Upcoming Panels Board
    #@param {Phaser.Game} game
    #@param {Gamefied} gamefield - The Gamefield
    #@param {int} x
    #@param {int} [y=100] Optional y coord
    constructor: (game,gamefield, x , y = 100 )->
      if gamefield == undefined
        throw  new Error("Please parse a Gamefield")
      super(game,null, 'UpcomingPanelsBoard',false,false)
      @gamefield = gamefield
      @x = x ? game.world.width - 60
      @y = y

    #Shows the Board
    #return {Phaser.Tween}
    show: ()=>
      @game.world.addChild(@)
      @x = @game.world.width
      @game.add.tween(@).to({x: @game.world.width-140 },1000,Phaser.Easing.Linear.None,true);



    #Add a new panel and set this into line
    #@param {Panel} panel the panel to add
    add: (panel)=>
      if not panel instanceof Panel
        throw new Error("Please parse a Panel Instance")
      panel.setPosition(@children.length+1,1)
      super(panel)
      index = @children.indexOf(panel)

      #Set panels like a carpet
      panel.x =  panel.x + (panel.getBounds().width/3 * index)

    #Remove the oldest Panel in children Array
    #@return {Panel}
    popNextPanel: =>
      nextPanel = @children[0]
      @remove(nextPanel)
      return nextPanel

    #Handle a new Gamestate and update the new Panel Board#
    #@return void
    handleNetworkGameState: (data)=>
      @removeAll(true) #Remove all old childs
      for panelId in data.nextPanels
        @add(new Panel(@game,@,Panel.getTypeById(panelId)))

      @gamefield.setPanelToPlace(@popNextPanel())

