var Field = require('./Field');

exports.createSession = function (inSocket, inSessionId) {
    // Private Property;
    var socket1   = inSocket;
    var socket2   = null;
    var observers = []; // an Array of Sockets for Obersvers
    var field     = new Field.createField();
    var id        = inSessionId;
    var started   = false;

    // Public Property
    //this.id = inSessionId;

    // Private Methode
    function broadcast(inType, inData) {
        socket1.emit(inType, inData);

        if (socket2 != null) {
            socket2.emit(inType, inData);
        }

        _.each(observers, function(socket) {
            console.log("send to" + socket.id);
            socket.emit(inType, inData);
        });
    }

    // Public Methode
    this.getSessionId = function() {
        return id;
    }

    this.getField = function() {
        return field;
    }

    this.joinAsPlayer = function(inSocket2) {
        socket2 =  inSocket2;
        return this;
    }

    this.joinAsObserver = function(inSocketObserver) {
        observers.push(inSocketObserver);
        return this;
    }

    this.sendGameState = function () {
        broadcast("GameState", field);
    }

    this.sendGameStart = function () {
        broadcast("GameStart", field);
    }

    this.isFull = function () {
        if(socket1 != null && socket2 != null) {
            return true; 
        } else {
            return false;
        }
    }

    this.start = function () {
        this.sendGameStart();
    }

    return this;
}

exports.findGameSession = function(inArray, inSessionId) {
    var session = _.find(inArray, function(obj){
        return obj.getSessionId() == inSessionId;
    });
    return session;
}