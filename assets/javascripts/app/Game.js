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
    './Banner',
    './Seal'],
function (Phaser, $, Panel, network, _, Gamefield, Scoreboard, Player, UpcomingPanelsBoard, SealBoard, Banner,Seal){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var gamefield;
    var upcomingPanelBoad;
    var scoreTable;

    //Get Vars from server
    var registername = prompt("Wie heißt du?", "");//$("#registername").text(); 
    $("#registername").text(registername);
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
        Seal.preload(game)
        game.load.image('ship',game.normalizeUrl('/Images/Schiff.png'));
        game.load.image('shipBroken',game.normalizeUrl('/Images/SchiffAufgebrochen.png'));
        game.load.image('shipBrick',game.normalizeUrl('/Images/SchiffBrick.png'));
   }
    
    function create () {
        game.stage.disableVisibilityChange = true;
        game.physics.startSystem(Phaser.Physics.P2JS);
        shipStripe = game.add.sprite(game.world.width,-80, 'ship');


        shipStripe.scale.setTo(0.5);
        
        beachSound = game.sound.play("beach", 1, true);


        you = new Player(registername,registername)
        gamefield = new Gamefield(game,you)
        upcomingPanelBoad = new UpcomingPanelsBoard(game,gamefield)

        Scoreboard.create(game);

        //game.sound.volume = 0;

        game.physics.p2.restitution = 0.0;
        game.physics.p2.gravity.y = 300;
        window.test = game;


        network.addGameStartEventListener(handelGameStart);         // is called when the game starts
        network.addNewGameStateEventListener(handelGameState);      // is called when a new GameState arrives
        network.addScoreEventListener(handelScore);                 // is called when a new Score arrives
        network.addSlidePostionEventListener(handelSlidePostion);   // is called when the current slider move the current panel
        network.addNotificationEventListener(handelNotification);   // is called when a notification happend
        network.addDisconnectEventListener(handelDisconnect);       // is called when a disconnect happend
        network.register(registername, sessionid);                  // register the client at the server and join a session



        time = 5000
        shipTween = game.add.tween(shipStripe).to({x:-140}, time, Phaser.Easing.Quadratic.In, true, 0, false);
        game.add.tween(shipStripe.scale).to({x:0.75, y:0.75}, time, Phaser.Easing.Quadratic.In, true, 0, false);
        sirenSound = game.sound.play("siren", 0.5, false);



        var run = false
        if (run == false){
            shipTween.onComplete.add(function(){
                shakeTween = game.add.tween(shipStripe).to({ x: -150 }, 100, Phaser.Easing.Quadratic.In,true,1,10).yoyo(true).loop().start();
                icecrushSound = game.sound.play("icecrash", 1, false);

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
                                game.add.tween(scoreTable).to({alpha: 1},1000);
                                game.world.bringToTop(shipStripeBick)
                            }
                        },this)
                        run2 = false
                        shipStripeBickTween.onComplete.add(function(){

                            if(run2 == false){
                                 run2 = true
                                 $('#info').first().fadeIn()
                                 upcomingPanelBoad.show()
                                 Scoreboard.show();
                             }
                        },this)

                        if (run == false) {
                            shipStripeBickTween.start()
                        }
                    }

                },this)

            },this)
        }

        $('#mute').click(function(){
            if ($(this).text() == "Mute") {
                game.sound.volume = 0;
                $(this).text("Unmute");
            } else {
                game.sound.volume = 1;
                $(this).text("Mute");
            }    
        });

    }

    function update(){
        /*
        if(  game.sound.volume < 1){
            game.sound.volume =  game.sound.volume +0.0001
        }*/
        
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
