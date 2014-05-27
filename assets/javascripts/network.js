define(['_'], function () {
    var GameStartFunction;
    var NewGameStateFunction;
    var DisconnectFunction;

    socket = io.connect();
        console.log('SlideASeal Network Modul');
        console.log('Socket.io v' + io.version + ' - Protocol: ' + io.protocol);

    // Request
    register = function(inName, inSessionId) {
        console.log("SEND: register with name: " + inName + ", sessionid: " + inSessionId );
        socket.emit('register', { name: inName, sessionid: inSessionId });
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


    socket.on('disconnect', function(data) {
        console.log("RECEIVE: disconnect");

        // handel disconnect?
    });

    // EventListener
    addGameStartEventListener = function(inFunction) {
        GameStartFunction = inFunction;
    }

    addNewGameStateEventListener = function(inFunction) {
        NewGameStateFunction = inFunction;
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
        addDisconnectEventListener: addDisconnectEventListener
    };

});
