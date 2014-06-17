"use strict"

/**
 * Module dependencies.
 */

var express = require("express"),
    path    = require("path"),
    sio     = require("socket.io"),
    routes  = require("./routes"),
    exphbs  = require("express3-handlebars"),
    _       = require("underscore"),
    colors  = require("colors");

var GameSession = require('./class/GameSession');

    // all environments
    var app = express();
    var server = require('http').createServer(app);
    var io = sio.listen(server);

    app.set("port", process.env.PORT || 3333);
    app.set("views", __dirname + "/views");
    app.engine("handlebars", exphbs({defaultLayout: "main"}));
    app.set("view engine", "handlebars");
    app.use(express.favicon());
    //app.use(express.logger("dev"));
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(express.methodOverride());
    app.use(express.compress());
    app.use(app.router);
    app.use(require("sass-middleware")({ src: __dirname + "/public" }));
    app.use(express.static(path.join(__dirname, "public")));

    // development only
    if ("development" == app.get("env")) {
        app.use(express.errorHandler());
    }

    app.get("/session/:sessionid/:registername", routes.index);
    //app.get("/:sessionid", routes.index);
    //app.get("/", routes.index);

    var GameSessions = [];

    io.set("log level", 2); 
    io.sockets.on("connection", function (socket) {

        // handle disconnects
        socket.on("disconnect", function () {
            var session = GameSession.findGameSession(GameSessions, socket.sessionid);

            session.disconnect(socket);
            console.log("disconnect " + socket.name);
        });

        // register players
        socket.on("register", function (data) {
            socket.name = data.registername;
            socket.score = 0;

            var session = GameSession.findGameSession(GameSessions, data.sessionid);

            console.log("register Player with Name: " + data.registername);

            if(session != undefined && !(session.isFull())) {
                // join session
                session.joinAsPlayer(socket);
                socket.sessionid = session.getSessionId();

                if(session.getGameState().isStarted()) {
                    session.sendGameState();
                } else {
                    session.startSession(socket);
                }
            } else if(session != undefined && session.isFull()) {
                // join session as observer
                session.joinAsObserver(socket);
                socket.sessionid = session.getSessionId();

                session.sendGameState();
            } else {
                // create session
                session = new GameSession.GameSession(socket, data.sessionid);
                socket.sessionid = session.getSessionId();

                GameSessions.push(session);
            }
            
        });

        socket.on("slide", function(data) {
            var session = GameSession.findGameSession(GameSessions, socket.sessionid);
            
            if(session.getGameState().isStarted() && session.getGameState().checkSliderSocketById(socket.id)) {
                console.log("[" + session.getSessionId() + "] Player slide at m: " + data.m + ", n: " + data.n + " - Name: " + socket.name);
                session.getGameState().update(socket, session, data.m, data.n);
                session.sendGameState();
            } else {
                console.log("[" + session.getSessionId() + "] No Turn - Player want to slide at m: " + data.m + ", n: " + data.n + " - Name: " + socket.name);
                socket.emit("notification", {msg: "not your turn"});
            }
        });

        socket.on("slidePostion", function(data) {
            var session = GameSession.findGameSession(GameSessions, socket.sessionid);

            if(session.getGameState().checkSliderSocketById(socket.id)) {
                session.sendSlidePostion(data);
            }
        });

    });

    server.listen(app.get("port"), function(){
        console.log("SlideASeal-Server listening on port " + app.get("port"));
    });
