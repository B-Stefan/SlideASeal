define ['Phaser', './SealBoard'], (Phaser, SealBoard)->


  #This class controls one Seal on the screen
  class Seal extends Phaser.Group
    # Load all sprites and sounds
    # @static
    #
    @preload: (game)->
      game.load.spritesheet('RobbeClapRight', game.normalizeUrl('/Images/Robbe.png'), 520, 520, 17);
      game.load.spritesheet('RobbeBallRight', game.normalizeUrl('/Images/RobbeBall.png'), 520, 520, 18);

      game.load.spritesheet('RobbeClapLeft', game.normalizeUrl('/Images/Robbelinks.png'), 520, 520, 17);
      game.load.spritesheet('RobbeBallLeft', game.normalizeUrl('/Images/RobbeBallLinks.png'), 520, 520, 18);


      game.load.audio("beach", game.normalizeUrl('/sounds/ambient/beach.ogg'), true);
      game.load.audio("icecrash", game.normalizeUrl('/sounds/ambient/icecrash.ogg'), true);
      game.load.audio("siren", game.normalizeUrl('/sounds/ambient/siren.ogg'), true);
      game.load.audio("seal1", game.normalizeUrl('/sounds/seals/seal1.ogg'), true);
      game.load.audio("seal2", game.normalizeUrl('/sounds/seals/seal2.ogg'), true);
      game.load.audio("seal3", game.normalizeUrl('/sounds/seals/seal3.ogg'), true);
      game.load.audio("seal4", game.normalizeUrl('/sounds/seals/seal4.ogg'), true);
      game.load.audio("seal5", game.normalizeUrl('/sounds/seals/seal5.ogg'), true);
      game.load.audio("seal6", game.normalizeUrl('/sounds/seals/seal6.ogg'), true);
      game.load.audio("seal7", game.normalizeUrl('/sounds/seals/seal7.ogg'), true);
      game.load.audio("seal8", game.normalizeUrl('/sounds/seals/seal8.ogg'), true);
      game.load.audio("seal9", game.normalizeUrl('/sounds/seals/seal9.ogg'), true);
      game.load.audio("seal10", game.normalizeUrl('/sounds/seals/seal10.ogg'), true);
      game.load.audio("seal11", game.normalizeUrl('/sounds/seals/seal11.ogg'), true);
      game.load.audio("seal11", game.normalizeUrl('/sounds/seals/seal12.ogg'), true);

    #@static
    #Animation types
    @animationTypes: {
      CLAP: 10
      BALL: 20
      POFF: 30
    }

    #@Static
    #The Postion of the seal
    @sides: {
      LEFT: 10
      RIGHT: 20
    }

    #@static
    #@param {Seal.side} side - The side for the seal
    #@returns {Array<String>} A array of lenght 2
    @getSpriteNameBySide: (side)->
      switch (side)
        when Seal.sides.LEFT
          return ['RobbeClapLeft', 'RobbeBallLeft']
        when Seal.sides.RIGHT
          return ['RobbeClapRight', 'RobbeClapRight']

    #@static
    #returns a static animation
    #@retuns {Seal.animations}
    @getRandomAnimationType: ()->
      list = [];
      for key, value of Seal.animationTypes
        list.push(value)
      return list[Math.floor(Math.random()*list.length)]

    #@param {Phaser.Game}
    #@param {Phaser.Sealboard}
    #@param {int} x
    #@param {int} y
    #@param {SealBoard.sides} side Gibt die Seite an auf denen die Robbe angezeigt wird
    constructor: (game,parent, x = 0 , y = 0, side = Seal.sides.LEFT )->
      super(game,parent,'ROBBE_GROUP',true)

      spriteNames = Seal.getSpriteNameBySide(side)

      @seal = @create(x,y,spriteNames[0])
      @setSize(@seal)
      @seal.animations.add("clap",null,11)
      @seal_side = side


      @sealBall = @create(x,y,spriteNames[1])
      @setSize(@sealBall)
      @sealBall.visible = 0;
      @sealBall.animations.add("ball",null,11)


    # Setter for the side
    # @param {Seal.sides} side
    setSide: (side)=>
      @seal_side

    # Getter for the side
    # @return {Seal.sides} side
    getSide: ()=>@seal_side

    # Set the seal to a specific size, anchor and local x,y
    # @param {Seal} seal the seal to set size
    setSize: (seal)=>
      seal.anchor.setTo(0.5,0.5)
      #Korrekt size
      seal.x = (seal.getBounds().width-200) * seal.anchor.x
      seal.y = (seal.getBounds().height-300) * seal.anchor.y * -1
      seal.scale.setTo(0.3,0.3)

    # Set the seal postions from sealToHide to sealToShow
    # and set visible to 1
    # @param {Seal} sealToShow The seal you want to show
    # @param {Seal} sealToHide The seal you want to hide
    syncPositions: (sealToShow, sealToHide)=>
      sealToShow.y = sealToHide.y
      sealToShow.x = sealToHide.x
      sealToShow.visible = 1
      sealToHide.visible = 0


    # Play a random sequenz of animations
    # @retuns {Phaser.Tween|null|Phaser.time.event}
    playRandomAnimation: ()=>
      switch (Seal.getRandomAnimationType())
        when Seal.animationTypes.BALL
            @syncPositions(@sealBall,@seal)
            tween = @sealBall.play("ball")
            if tween != undefined
              tween.onComplete.add(()->
                @syncPositions(@seal,@sealBall)
                if Math.random() < 0.5
                  @playRandomAnimation()
              ,@)
            return tween

        when Seal.animationTypes.CLAP
            @syncPositions(@seal,@sealBall)
            @seal.play("clap")
        when Seal.animationTypes.POFF
          @playRandomAnimation()

    changeSide: (newSealBoard)=>

      sealBoard = newSealBoard
      bounds = @getBounds()

      if @getSide() == Seal.sides.LEFT
        newX = @game.world.width - Math.random()*200
      else if @getSide() == Seal.sides.RIGHT
        newX = Math.random()*200

      newY = @y

      delay = Math.random()
      tween = @game.add.tween(@).to(x: newX, y: newY,1000,Phaser.Easing.Quadratic.Out,true,delay)
      tween.onComplete.add(()->
        console.log("Complete")
        newSeal = new Seal(@game,sealBoard,0,0,sealBoard.getSide())
        newSeal.setRandomPosition(sealBoard.getRandomSeal())
        sealBoard.add(newSeal,false)
        @destroy()
      , @)


    setRandomPosition: (relatedSeal = null)=>
      newX = 0
      newY = 0
      #If seals in Group, get Last seal and place new Seal near by the old seal
      if relatedSeal != null
        relatedSealBounds = relatedSeal.getBounds()
        newX = relatedSeal.x + relatedSealBounds.width/10
        newY = relatedSeal.y

        newX = newX + 20 + Math.floor(Math.random()*150) # x var big because we have on x much more place
        newY = newY + 15 + Math.floor(Math.random()*20)  # y var small because no place in vertical orientation

      @x = newX
      @y = newY




