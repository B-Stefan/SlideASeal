var _ = require("underscore");

var GameState = require("./GameState");

/**
 * Creates an instance of Field.
 *
 * @constructor
 * @this {Field}
 */
exports.GameSession = function (inSocket, inSessionId) {
    // Private Property;
    var socket1   = inSocket;
    var socket2   = null;
    var observers = []; // an Array of Sockets for Obersvers
    var state     = new GameState.GameState();
    var id        = inSessionId;
    var started   = false;

    broadcast("notification", {msg: "wait for a other player"});

    // Private Methode
    function broadcast(inType, inData) {
        if (socket1 != null) {
            socket1.emit(inType, inData);
        }

        if (socket2 != null) {
            socket2.emit(inType, inData);
        }

        _.each(observers, function(socket) {
            socket.emit(inType, inData);
        });
    }

    function sendScore() {
        // Player 1 on socket1
        var score = {
            you: {
                name: socket1.name,
                score: socket1.score
            },
            rival: {
                name: socket2.name,
                score: socket2.score
            }
        };

        socket1.emit("Score", score);

        // Player 2 on socket2
        score = {
            you: {
                name: socket2.name,
                score: socket2.score
            },
            rival: {
                name: socket1.name,
                score: socket1.score
            }
        };

        socket2.emit("Score", score);

        // Observer
        score = {
            info: "you are a observer",
            player1: {
                name: socket1.name,
                score: socket1.score
            },
            player2: {
                name: socket2.name,
                score: socket2.score
            }
        }

        _.each(observers, function(socket) {
            socket.emit("Score", score);
        });
    }


    // Public Methode
    this.getSessionId = function() {
        return id;
    }

    this.getOtherSocket = function(inSocket) {
        if(inSocket == socket2) {
            return socket1;
        } else {
            return socket2;
        }
    }

    this.getGameState = function() {
        return state;
    }

    this.joinAsPlayer = function(inSocket) {
        broadcast("notification", {msg: "a player join the game", name: inSocket.name});

        if (socket1 == null) {
            socket1 = inSocket;
        } else {
            socket2 = inSocket;
        }

        state.setSliderSocket(inSocket);
    }

    this.disconnect = function(inSocket) {
        if (inSocket == socket1) {
            broadcast("notification", {msg: "a player leave the game", name: inSocket.name});
            socket1 = null;
        } else if(inSocket == socket2) {
            broadcast("notification", {msg: "a player leave the game", name: inSocket.name});
            socket2 = null;
        }  
    }

    this.joinAsObserver = function(inSocketObserver) {
        broadcast("notification", {msg: "a observer join the game", name: inSocketObserver.name});

        observers.push(inSocketObserver);
        return this;
    }

    this.sendGameState = function () {
        sendScore();
        broadcast("GameState", state);
    }

    this.sendGameStart = function () {
        broadcast("GameStart", state);
    }

    this.sendSlidePostion = function (data) {
        broadcast("slidePostion", data);
    }

    this.isFull = function () {
        if(socket1 != null && socket2 != null) {
            return true; 
        } else {
            return false;
        }
    }

    this.startSession = function () {
        state.setSliderSocket(socket2);
        state.startGame();

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