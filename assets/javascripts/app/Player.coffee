define [], ()->
  class Player

    constructor: (name,sessionId)->
      @name = name
      @sessionid = sessionId
    getSessionId: ()=> @sessionid
    getName: ()=>
      @name
    setName: (name) =>
      @name = name

