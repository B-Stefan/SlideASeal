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
    var socket2   = undefined;
    var observers = []; // an Array of Sockets for Obersvers
    var state     = new GameState.GameState();
    var id        = inSessionId;

    console.log("[" + id + "] open Session as Player - Name: " + inSocket.name);
    broadcast("notification", {msg: "you open a session", name: inSocket.name, side: "left"});
    broadcast("notification", {msg: "wait for a other player"});

    // Private Methode
    function broadcast(inType, inData) {
        if (socket1 != undefined) {
            socket1.emit(inType, inData);
        }

        if (socket2 != undefined) {
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
                score: socket1.score,
                side: "left"
            },
            rival: {
                name: socket2.name,
                score: socket2.score,
                side: "right"
            }
        };

        if (socket1 != undefined) {
            socket1.emit("Score", score);
        }        

        // Player 2 on socket2
        score = {
            you: {
                name: socket2.name,
                score: socket2.score,
                side: "right"
            },
            rival: {
                name: socket1.name,
                score: socket1.score,
                side: "left"
            }
        };

        if (socket2 != undefined) {
            socket2.emit("Score", score);
        }

        // Observer
        score = {
            info: "you are a observer",
            player1: {
                name: socket1.name,
                score: socket1.score,
                side: "left"
            },
            player2: {
                name: socket2.name,
                score: socket2.score,
                side: "right"
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

        if (socket1 == undefined) {
            broadcast("notification", {msg: "a player join the game", name: inSocket.name, side: "left"});
            socket1 = inSocket;
            console.log("[" + id + "] join Session as Player on socket1 - Name: " + inSocket.name);
        } else {
            broadcast("notification", {msg: "a player join the game", name: inSocket.name, side: "right"});
            socket2 = inSocket;
            console.log("[" + id + "] join Session as Player on socket2 - Name: " + inSocket.name);
        }

        state.setSliderSocket(inSocket);
    }

    this.disconnect = function(inSocket) {
        if (inSocket == socket1) {
            broadcast("notification", {msg: "a player leave the game", name: inSocket.name});
            socket1 = undefined;
        } else if(inSocket == socket2) {
            broadcast("notification", {msg: "a player leave the game", name: inSocket.name});
            socket2 = undefined;
        }  
    }

    this.joinAsObserver = function(inSocketObserver) {
        console.log("[" + id + "] join Session as Observer - Name: " + inSocketObserver.name);
        broadcast("notification", {msg: "a observer join the game", name: inSocketObserver.name});

        observers.push(inSocketObserver);
        return this;
    }

    this.sendGameState = function () {
        sendScore();
        broadcast("GameState", state);
    }

    this.sendGameStart = function () {
        sendScore();
        broadcast("GameStart", state);
    }

    this.sendSlidePostion = function (data) {
        broadcast("slidePostion", data);
    }

    this.isFull = function () {
        if(socket1 != undefined && socket2 != undefined) {
            return true; 
        } else {
            return false;
        }
    }

    this.startSession = function (inSocket) {
        state.setSliderSocket(inSocket);
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