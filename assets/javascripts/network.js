define(['_'], function () {
    var GameStartFunction;
    var NewGameStateFunction;
    var ScoreFunction;
    var DisconnectFunction;

    var name;
    var sessionid;

    socket = io.connect();
        console.log('SlideASeal Network Modul');
        console.log('Socket.io v' + io.version + ' - Protocol: ' + io.protocol);

    // Request
    register = function(inName, inSessionId) {
        console.log("SEND: register with name: " + inName + ", sessionid: " + inSessionId );
        socket.emit('register', { name: inName, sessionid: inSessionId });

        name = inName;
        sessionid  = inSessionId;
    }

    slide = function(m, n) {
        console.log("SEND: slide with m: " + m + ", n: " + n );
        socket.emit('slide', { m: m, n: n });
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

    addDisconnectEventListener = function(inFunction) {
        DisconnectFunction = inFunction;
    }

    return {
        socket: socket,
        register: register,
        slide: slide,
        addGameStartEventListener: addGameStartEventListener,
        addNewGameStateEventListener: addNewGameStateEventListener,
        addScoreEventListener: addScoreEventListener,
        addDisconnectEventListener: addDisconnectEventListener
    };

});
