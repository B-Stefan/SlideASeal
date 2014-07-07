define ['Phaser',
        './Seal',
        './Player'], (Phaser,Seal,Player)->

  #With the SealBoard class you can control a collection of Seals
  #@see Seal
  class SealBoard extends Phaser.Group

    #@static
    #Preload function for the game loader
    #@param {Phaser.Game}
    @preload:(game)->



    #Create a new Group for all seals of one player
    #@param {Phaser.Game} game - the game instace
    #@param {Seal.sides} side the position of the sealboard
    constructor: (game,side)->
      if not side of Seal.sides
        throw new Error "Pleas parse a Sealboard.position as position"
      super(game,null, 'SealBoard',false,false)
      if side == Seal.sides.LEFT
        @x = -100
      else if side == Seal.sides.RIGHT
        @x = @game.world.width/2 - 100
      @y = @game.world.height

      @side = side
      #Create 3 Seals per default
      @create()
      @create()
      @create()

    #Show the board and each Seal individually
    #Slide the seal form right or left into the screen
    show: ()=>
      @game.add.existing(this)

      #Slide each Seal in
      for seal in @children
        oldX = seal.x
        oldY = seal.y

        #Set postion of seal outside of the World
        if @side == Seal.sides.LEFT
          seal.x = -200
        else if @side == Seal.sides.RIGHT
          seal.x = @game.world.width - @x + 100

        #Tween to old psotion
        lastTween = @game.add.tween(seal).to(x:oldX,y:oldY,1000,Phaser.Easing.Quadratic.Out,true,Math.random()*1000)


      #If all displayed, start loop
      lastTween.onComplete.add(()->
        @startAnimationLoop()
      ,@)

    #Starts the animation loop
    #@return {Phaser.time.event} - The time event to spot loop
    startAnimationLoop:(delayInSeconds = 4)=>

      #Loop event
      @game.time.events.loop(Phaser.Timer.SECOND*delayInSeconds, ()->
        #in 50 percent of the cases play random loop, else play all Seals animation
        if Math.random() > 0.5
          @getRandomSeal().playRandomAnimation()
        else
          @playRandomAnimation()
      ,@)

    #Setter for postion
    #@param {Seal.sides} side  The Position
    setPosition: (side)=>
      if not side of Player.sides
        throw  new Error ("Please parse a side enum type")

    #Play the Random Animation for each Seal with  delay between 1 and 2 seconds
    #@returns {Phaser.events.time | null | Phaser.Tween }
    playRandomAnimation: ()=>
      for seal in @children
        @game.time.events.add(Phaser.Timer.SECOND * Math.random(), ()->
          seal.playRandomAnimation()
        ,@)


    #Create a new Seal
    #@param {int} [x=0] The x coord
    #@param {int} [y=0] The x coord
    create: (x = 0,y = 0)=>
      seal = new Seal(@game,@,x,y,@side)
      @add(seal)

    #Retuns a random Seal
    #@return {Seal} the Random entry
    getRandomSeal: ()=>
      return @children[Math.floor(Math.random()*@children.length)]

    #Add a new seal
    #@param {Seal} newSeal
    #@param {boolean} randomPosition - set the newSeal to a random psotion in the seide bounce
    add: (newSeal, randomPostion = true )=>
      if newSeal not instanceof  Seal
        throw new Error ("Pleas parse a Seal instnace ")

      #Random Postion
      if randomPostion == true
       newSeal.setRandomPosition(@children[@children.length-1])

      super(newSeal)


    #Change the numberOfSealsToChange to the sealBoardToAdd
    #Animatie the Seals kill them and add new seals to the other Board
    #@param {int} numberOfSealsToChange - The Number of Seals to move to the ohter Sealboard
    #@param {SealBoard} sealBoardToAdd - The target for the seals
    #@returns {Phaser.Tween}
    changeSealSide: (numberOfSealsToChange, sealBoardToAdd) =>
      i = 0
      sealsToChange = []
      while i != numberOfSealsToChange
        randomSeal = @getRandomSeal()
        #If no seals there
        if(randomSeal == null or randomSeal == undefined )
          break
        else
          sealsToChange.push(randomSeal)
        i = i+1

      for seal in sealsToChange
        seal.changeSide(sealBoardToAdd)

    #Returns the number of seals
    #@return {int}
    getNumberOfSeals: ()=> @children.length

    # Getter for side
    # @return {Seal.sides}
    getSide: ()=> @side