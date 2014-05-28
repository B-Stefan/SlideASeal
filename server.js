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

    app.set("port", process.env.PORT || 3000);
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

    app.get("/:sessionid", routes.index);
    app.get("/", routes.index);

    var GameSessions = [];

    io.set("log level", 2); 
    io.sockets.on("connection", function (socket) {

        // handle disconnects
        socket.on("disconnect", function () {
            console.log("disconnect " + socket.name);
        });

        // register players
        socket.on("register", function (data) {
            console.log("New Player: " + data.name);
            socket.name = data.name;

            var session = GameSession.findGameSession(GameSessions, data.sessionid);
            
            if(session != undefined && !(session.isFull())) {
                session = session.joinAsPlayer(socket);
                console.log("join Session created with ID: " + session.getSessionId());
                socket.sessionid = session.getSessionId();

                session.start();
            } else if(session != undefined && session.isFull()) {
                console.log("observer");
                session.joinAsObserver(socket);
            } else {
                session = new GameSession.GameSession(socket, data.sessionid);
                console.log("New Session created with ID: " + session.getSessionId());
                socket.sessionid = session.getSessionId();
                session.start();

                GameSessions.push(session);
            }
            
        });

        socket.on("slide", function(data) {
            console.log("Player " + socket.name + " slided at " + data.m + ", " + data.n);
            var session = GameSession.findGameSession(GameSessions, socket.sessionid);
            session.getGameState().update(data.m, data.n);
            session.sendGameState();
        });

    });

    server.listen(app.get("port"), function(){
        console.log("SlideASeal-Server listening on port " + app.get("port"));
    });
