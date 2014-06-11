define(['_'], function () {
    var GameStartFunction;
    var NewGameStateFunction;
    var ScoreFunction;
    var SlidePostionFunction;
    var DisconnectFunction;

    var registername;
    var sessionid;

    socket = io.connect();
        console.log('SlideASeal Network Modul');
        console.log('Socket.io v' + io.version + ' - Protocol: ' + io.protocol);

    // Request
    register = function(inName, inSessionId) {
        console.log("SEND: register with name: " + inName + ", sessionid: " + inSessionId );
        socket.emit('register', { registername: inName, sessionid: inSessionId });

        registername = inName;
        sessionid  = inSessionId;
    }

    slide = function(m, n) {
        console.log("SEND: slide with m: " + m + ", n: " + n );
        socket.emit('slide', { m: m, n: n });
    }

    sendSlidePostion = function(m, n) {
        console.log("SEND: slidePostion with m: " + m + ", n: " + n );
        socket.emit('slidePostion', { m: m, n: n });
    }

    // Response
    socket.on('GameStart', function(data) {
        console.log("RECEIVE: GameStart");
        GameStartFunction(data);
    });

    socket.on('GameState', function(data) {
        console.log("RECEIVE: GameState");
        NewGameStateFunction(data);
    });

    socket.on('Score', function(data) {
        console.log("RECEIVE: Score");
        ScoreFunction(data);
    });

    socket.on('slidePostion', function(data) {
        console.log("RECEIVE: slidePostion");
        SlidePostionFunction(data);
    });

    socket.on('disconnect', function(data) {
        console.log("RECEIVE: disconnect and try to register after 4s again");
        setTimeout(function() {
            register(name, sessionid);
        }, 4000);
    });

    // EventListener
    addGameStartEventListener = function(inFunction) {
        GameStartFunction = inFunction;
    }

    addNewGameStateEventListener = function(inFunction) {
        NewGameStateFunction = inFunction;
    }

    addScoreEventListener = function(inFunction) {
        ScoreFunction = inFunction;
    }

    addSlidePostionEventListener = function(inFunction) {
        SlidePostionFunction = inFunction;
    }

    addDisconnectEventListener = function(inFunction) {
        DisconnectFunction = inFunction;
    }

    return {
        socket: socket,
        register: register,
        slide: slide,
        sendSlidePostion: sendSlidePostion,
        addGameStartEventListener: addGameStartEventListener,
        addNewGameStateEventListener: addNewGameStateEventListener,
        addScoreEventListener: addScoreEventListener,
        addSlidePostionEventListener: addSlidePostionEventListener,
        addDisconnectEventListener: addDisconnectEventListener
    };

});
