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
    './SealBoard',
    './Banner'],
function (Phaser, $, Panel, network, _, Gamefield, Scoreboard, Player, UpcomingPanelsBoard, SealBoard, Banner){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var gamefield;
    var scoreboard;
    var upcomingPanelBoad;
    var sealBoard;

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
        Banner.preload(game);
        Gamefield.preload(game)
        UpcomingPanelsBoard.preload(game)
        SealBoard.preload(game)
        game.load.image('ship',game.normalizeUrl('/Images/Schiff.png'));
        game.load.image('shipBroken',game.normalizeUrl('/Images/SchiffAufgebrochen.png'));
        game.load.image('shipBrick',game.normalizeUrl('/Images/SchiffBrick.png'));

        game.load.audio("beachWithGulls", game.normalizeUrl('/sounds/beach_with_gulls.ogg'), true);
        game.load.audio("seal1", game.normalizeUrl('/sounds/seals/seal1.ogg'), true);
        game.load.audio("seal2", game.normalizeUrl('/sounds/seals/seal2.ogg'), true);
        game.load.audio("seal3", game.normalizeUrl('/sounds/seals/seal3.ogg'), true);
        game.load.audio("seal4", game.normalizeUrl('/sounds/seals/seal4.ogg'), true);
        game.load.audio("seal5", game.normalizeUrl('/sounds/seals/seal5.ogg'), true);
        game.load.audio("seal6", game.normalizeUrl('/sounds/seals/seal6.ogg'), true);
        game.load.audio("seal7", game.normalizeUrl('/sounds/seals/seal7.ogg'), true);
        game.load.audio("seal8", game.normalizeUrl('/sounds/seals/seal8.ogg'), true);
        game.load.audio("seal9", game.normalizeUrl('/sounds/seals/seal9.ogg'), true);
        game.load.audio("seal10", game.normalizeUrl('/sounds/seals/seal10.ogg'), true);
        game.load.audio("seal11", game.normalizeUrl('/sounds/seals/seal11.ogg'), true);
        game.load.audio("seal11", game.normalizeUrl('/sounds/seals/seal12.ogg'), true);
   }
    
    function create () {
        game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        shipStripe = game.add.sprite(game.world.width,-80, 'ship');
        shipStripe.scale.setTo(0.5)
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
        network.addScoreEventListener(handelScore);                 // is called when a new Score arrives
        network.addSlidePostionEventListener(handelSlidePostion);   // is called when the current slider move the current panel
        network.addNotificationEventListener(handelNotification);   // is called when a notification happend
        network.addDisconnectEventListener(handelDisconnect);       // is called when a disconnect happend
        network.register(registername, sessionid);                  // register the client at the server and join a session



        time = 5000
        shipTween = game.add.tween(shipStripe).to({x:-140}, time, Phaser.Easing.Quadratic.Out, true, 0, false);
        game.add.tween(shipStripe.scale).to({x:0.75, y:0.75}, time, Phaser.Easing.Quadratic.Out, true, 0, false);



        var run = false
        if (run == false){
            shipTween.onComplete.add(function(){
                shakeTween = game.add.tween(shipStripe).to({ x: -150 }, 100, Phaser.Easing.Quadratic.In,true,1,10).yoyo(true).loop().start();

                //If shake complete
                shakeTween.onComplete.add(function(){

                    if(run==false){
                        //Show broken ship
                        shipStripeBroken = game.add.sprite(shipStripe.x,shipStripe.y, 'shipBroken');
                        shipStripeBroken.scale.x = shipStripe.scale.x
                        shipStripeBroken.scale.y = shipStripe.scale.y
                        shipStripe.destroy()
                        shipStripe = shipStripeBroken
                        game.world.sendToBack(shipStripe)

                        shipStripeBick = game.add.sprite(shipStripe.x,shipStripe.y, 'shipBrick');
                        shipStripeBick.scale.x = shipStripe.scale.x
                        shipStripeBick.scale.y = shipStripe.scale.y

                        game.world.bringToTop(shipStripeBick)
                        shipStripeBickTween = game.add.tween(shipStripeBick).to({y: game.world.height +100},3000)
                        shipStripeBickTween.onStart.add(function(){
                            if (run == false) {
                                run  = true
                                gamefield.show()
                                game.world.bringToTop(shipStripeBick)
                            }
                        },this)

                        shipStripeBickTween.onComplete.add(function(){
                                $('#info').first().fadeIn()
                                upcomingPanelBoad.show()
                        },this)

                        if (run == false) {
                            shipStripeBickTween.start()
                        }
                    }

                },this)

            },this)
        }

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
        $('#info').remove()
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

    // handel Score
    function handelScore(data){
        Scoreboard.updateScoreboard(data); 
        sealBoard.handleNetworkScoreAction(data);
    }

    // handel SlidePostion
    function handelSlidePostion(data){
        //console.log('!!! SlidePostion !!!');
        //console.log("m: " + data.m + ", n:" + data.n);
        gamefield.handleNetworkSlideNewPanelPosition(data)
    }

    // handel Notification
    function handelNotification(data){
        //console.log('!!! Notification !!!');
        //console.log(data);
        
        if (data.msg == 'not your turn') {
            Banner.play('not-your-turn');
        }

        if (data.msg == 'your turn') {
            Banner.play('your-turn');  
        }

        if (data.msg == 'a player leave the game') {
            Banner.play('player-disconnected');
        }

        gamefield.handleNetworkNotification(data);
    }

    // handel Disconnect
    function handelDisconnect(){
        console.log('!!! Disconnect !!!');
    }

});
