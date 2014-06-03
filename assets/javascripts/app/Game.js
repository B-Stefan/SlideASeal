/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser', 'jquery', './Panel', 'network', '_', 'app/Gamefield'],function (Phaser, $, Panel, network, _,Gamefield){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var name = "Peter";
    var gamefield;

    var sessionid = $("#sessionid").text();         // in the future parsed from the dom 

   function preload() {
        game.load.image('ship','../Images/Schiff.svg');

        // establish Network Connection 
        network.addGameStartEventListener(handelGameStart);     // Is called when two Players are in one Game
        network.addNewGameStateEventListener(handelGameState);  // Is called when a new GameState arrives
        network.addDisconnectEventListener(handelDisconnect);   // Is called when a Disconnect happend
        network.register(name, sessionid);
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
    }

    // handel GameState
    function handelGameState(data){
        console.log('!!! New GameState !!!');
        console.log(data);
    }

    // handel Disconnect
    function handelDisconnect(){
        console.log('!!! Disconnect !!!');
    }

});
