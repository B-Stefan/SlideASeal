/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser', 'jquery', './Panel', 'network', '_', 'app/Gamefield'],function (Phaser, $, Panel, network, _,Gamefield){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var name = "Peter";
<<<<<<< HEAD
    var gamefield;

    var sessionid = $("#sessionid").text();         // in the future parsed from the dom 
=======
    var sessionid = $("#sessionid").text(); 
>>>>>>> 503ff6397a78b045d2c09ce1810260b34cb08850

   function preload() {
        game.load.image('ship','../Images/Schiff.svg');

        // establish Network Connection 
<<<<<<< HEAD
        network.addGameStartEventListener(handelGameStart);     // Is called when two Players are in one Game
        network.addNewGameStateEventListener(handelGameState);  // Is called when a new GameState arrives
        network.addDisconnectEventListener(handelDisconnect);   // Is called when a Disconnect happend
        network.register(name, sessionid);
=======
        network.addGameStartEventListener(handelGameStart);     // is called when the game starts
        network.addNewGameStateEventListener(handelGameState);  // is called when a new GameState arrives
        network.addScoreEventListener(handelScore);             // is called when new Score information are available
        network.addDisconnectEventListener(handelDisconnect);   // is called when a disconnect happend
        network.register(name, sessionid);                      // register the client at the server and join a session

>>>>>>> 503ff6397a78b045d2c09ce1810260b34cb08850
        Panel.loadAllTypes(game)
    }
    
    function create () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        shipStripe = game.add.sprite(game.world.width, 80, 'ship');
        gamefield = new Gamefield(game)

        //gamefield.enableBodyDebug = true;
        test3 = game.add.sprite(300, 180, 'Panel_Background');

        game.physics.p2.restitution = 0.0;
        game.physics.p2.gravity.y = 300;
        window.test = gamefield


        //test = gamefield.children[0].getBackgroundSprite()
        //test2 = gamefield.children[1].getBackgroundSprite()

        game.physics.p2.enable(gamefield,true,true)



        shipStripe.scale.setTo(0.9 , 0.9);
        game.add.tween(shipStripe).to({x:-20}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);



    }

    function update(){



    }

    // handel Slide
    handelSlide = function (m, n) {
        // Handle Click and than call this function.
        network.slide(m, n);
    }

    // handel GameStart
    function handelGameStart(data){
        console.log('!!! GameStart !!!');
        console.log(data);
        console.log("The next Panel is: " + data.nextPanels[0]);
        for(var i = 0; i < 5; i++) {
            console.log("| " + data.field[i][0] + " | " + data.field[i][1] + " | " + data.field[i][2] + " | " + data.field[i][3] + " | " + data.field[i][4] + " |")
            console.log("|---|---|---|---|---|")
        }
    }

    // handel GameState
    function handelGameState(data){
        console.log('!!! New GameState !!!');
        console.log(data);
        console.log("The next Panel is: " + data.nextPanels[0]);
        for(var i = 0; i < 5; i++) {
            console.log("| " + data.field[i][0] + " | " + data.field[i][1] + " | " + data.field[i][2] + " | " + data.field[i][3] + " | " + data.field[i][4] + " |")
            console.log("|---|---|---|---|---|")
        }
    }

   // handel Score
    function handelScore(data){
        console.log('!!! Score !!!');
        console.log("you score is: " + data.you.score);
        console.log("rival score is: " + data.rival.score);
        //console.log(data);
    }

    // handel Disconnect
    function handelDisconnect(){
        console.log('!!! Disconnect !!!');
    }

});
