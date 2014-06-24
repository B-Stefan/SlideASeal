/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser',
    'jquery',
    './Panel',
    'network',
    '_',
    './Gamefield',
    './Scoreboard',
    './Player',
    './UpcomingPanelsBoard',
    './SealBoard'],
function (Phaser, $, Panel, network, _, Gamefield, Scoreboard, Player,UpcomingPanelsBoard,SealBoard){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var gamefield;
    var scoreboard;
    var upcomingPanelBoad
    var sealBoard


    //Get Vars from server
    var registername = $("#registername").text(); 
    var sessionid = $("#sessionid").text();


    //Define Class extension of the game
    game._SAS_currentPlayer = null
    game.getCurrentPlayer = function(){
        return game._SAS_currentPlayer
    }
    game.setCurrentPlayer = function(player){
        game._SAS_currentPlayer = player
    }
    game.normalizeUrl = function(relativeUrl){
        return 'http://' + window.location.host + relativeUrl;
    }


   function preload() {
        Panel.loadAllTypes(game)
        Gamefield.preload(game)
        UpcomingPanelsBoard.preload(game)
        SealBoard.preload(game)
        game.load.image('ship',game.normalizeUrl('/Images/Schiff.svg'));

        game.load.audio("beachWithGulls", game.normalizeUrl('/sounds/beach_with_gulls.ogg'),true)


        //game.load.audio("beachWithGulls",game.normalizeUrl('/sounds/beach_with_gulls.ogg'),true)

   }
    
    function create () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        shipStripe = game.add.sprite(game.world.width,-50, 'ship');
        //beachSound = game.sound.play("beachWithGulls",1,true)


        you = new Player(registername,registername)
        gamefield = new Gamefield(game,you)
        upcomingPanelBoad = new UpcomingPanelsBoard(game,gamefield)
        sealBoard = new SealBoard(game,you)

        Scoreboard.create(game);

        game.sound.volume = 0;

        game.physics.p2.restitution = 0.0;
        game.physics.p2.gravity.y = 300;
        window.test = gamefield


        network.addGameStartEventListener(handelGameStart);         // is called when the game starts
        network.addNewGameStateEventListener(handelGameState);      // is called when a new GameState arrives
        network.addScoreEventListener(Scoreboard.updateScoreboard); // is called when new Score information are available
        network.addScoreEventListener(sealBoard.handleNetworkScoreAction); // is called when new Score information are available
        network.addSlidePostionEventListener(handelSlidePostion);   // is called when the current slider move the current panel
        network.addNotificationEventListener(handelNotification);   // is called when a notification happend
        network.addDisconnectEventListener(handelDisconnect);       // is called when a disconnect happend
        network.register(registername, sessionid);                  // register the client at the server and join a session



        game.add.tween(shipStripe).to({x:-100}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);
        game.add.tween(shipStripe.scale).to({x:1.1, y:1.1}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);
        /*
        robbe_eins = game.add.sprite(630, 400, 'Robbe');
        robbe = game.add.sprite(600, 430, 'Robbe2');

        robbe.scale.set(0.3);
        robbe_eins.scale.set(0.28);
        anim = robbe.animations.add('walk');
        anim.play( 13, true );
        anim_eins = robbe_eins.animations.add('walk');
        anim_eins.play( 10, true );
        anim = robbe.animations.add('walk');
        anim.play( 13, true );*/
    }

    function update(){

        if(  game.sound.volume < 1){
            game.sound.volume =  game.sound.volume +0.0001
        }
        
    }

    // send Slide
    sendSlide = function (m, n) {
        // Click and than call this function.
        network.slide(m, n);
    }

    // send SlidePostion
    sendSlidePostion = function (m, n) {
        network.sendSlidePostion(m, n);
    }

    // handel GameStart
    function handelGameStart(data){
        console.log('!!! GameStart !!!');
        handelGameState(data)
    }
    // handel GameState
    function handelGameState(data){
        console.log('!!! New GameState !!!');
        console.log(data);
        console.log(data.actions[0])
        console.log("The next Panel is: " + data.nextPanels[0]);
        for(var i = 0; i < 5; i++) {
            console.log("| " + data.field[i][0] + " | " + data.field[i][1] + " | " + data.field[i][2] + " | " + data.field[i][3] + " | " + data.field[i][4] + " |")
            console.log("|---|---|---|---|---|")
        }

        if (gamefield.getSize() == 0){
            gamefield.createGamefield(data.field)
        }
        gamefield.handleNetworkGameState(data)
        upcomingPanelBoad.handleNetworkGameState(data)
    }

    // handel SlidePostion
    function handelSlidePostion(data){
        console.log('!!! SlidePostion !!!');
        console.log("m: " + data.m + ", n:" + data.n);
        gamefield.handleNetworkSlideNewPanelPosition(data)
    }

    // handel Notification
    function handelNotification(data){
        console.log('!!! Notification !!!');
        gamefield.handleNetworkNotification(data)
        console.log(data);
    }

    // handel Disconnect
    function handelDisconnect(){
        console.log('!!! Disconnect !!!');
    }

});
