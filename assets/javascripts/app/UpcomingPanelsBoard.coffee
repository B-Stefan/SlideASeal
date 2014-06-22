define ['Phaser', './Panel'], (Phaser,Panel)->
  class UpcommingPanelsBoard extends Phaser.Group

    @preload: (game)->
      console.log('')
    constructor: (game,gamefield, x , y = 50 )->
      if gamefield == undefined
        throw  new Error("Please parse a Gamefield")
      super(game,null, 'UpcomingPanelsBoard',true,true)
      @gamefield = gamefield
      @x = x ? game.world.width - 120
      @y = y

    add: (panel)=>
      panel.setPosition(@children.length+1,1)
      super(panel)

    popNextPanel: =>
      nextPanel = @children[0]
      @remove(nextPanel)
      return nextPanel
    handleNetworkGameState: (data)=>
      @removeAll(true) #Remove all old childs
      for panelId in data.nextPanels
        @add(new Panel(@game,@,Panel.getTypeById(panelId)))
      @gamefield.setPanelToPlace(@popNextPanel())

