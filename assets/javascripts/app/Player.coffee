define [], ()->
  #@class
  #Player class
  class Player

    #@static
    #@enum
    #Represents the sides of the players
    @sides:
      LEFT: 10
      RIGHT: 20

    constructor: (name,sessionId)->
      @name = name
      @sessionid = sessionId
      @side = null

    getSessionId: ()=> @sessionid

    #Set the side of the Player
    #@param {Player.side} side
    setSide: (side)=>
      @side = side

    # Returns the side of the Player
    # @return Player.side
    getSide: ()=>
      @side

    getName: ()=>
      @name
    setName: (name) =>
      @name = name

