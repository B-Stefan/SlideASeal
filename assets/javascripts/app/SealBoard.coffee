define ['Phaser',
        './Seal',
        './Player'], (Phaser,Seal,Player)->
  class SealBoard extends Phaser.Group

    
    #@static
    #Preload function for the game loader
    #@param {Phaser.Game}
    @preload:(game)->
      game.load.spritesheet('RobbeClapRight', game.normalizeUrl('/Images/Robbe.png'), 520, 520, 17);
      game.load.spritesheet('RobbeBallRight', game.normalizeUrl('/Images/RobbeBall.png'), 520, 520, 18);
      game.load.spritesheet('RobbeClapLeft', game.normalizeUrl('/Images/Robbelinks.png'), 520, 520, 17);
      game.load.spritesheet('RobbeBallLeft', game.normalizeUrl('/Images/RobbeBallLinks.png'), 520, 520, 18);
      game.load.image('Poff', game.normalizeUrl('/Images/POff.png'));


    #Create a new Group for all seals of one player
    #@param {Phaser.Game} game - the game instace
    #@param {Player} player - the owner of the seal board
    constructor: (game,player)->
      super(game,null,'UpcomingPanelsBoard',true,true)
      @_SAS_player = player



    setPosition: (side)=>
      if not side of Player.sides
        throw  new Error ("Please parse a side enum type")


    createSeal: ()=>
      newSeal = new Seal(@game)

    #Add a new seal
    add: (newSeal )=>
      if newSeal not instanceof  Seal
        throw new Error ("Pleas parse a Seal instnace ")

      super(newSeal)

    #returns the owner of the sealBoard
    #@return Player
    getPlayer: ()=> @_SAS_player


    #Handle the network score action
    handleNetworkScoreAction: (scoreData)=>
      console.log(scoreData)

