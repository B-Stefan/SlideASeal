/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser', 'jquery', './Panel', 'network', '_'],function (Phaser, $, Panel, network, _){

    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update }, true);
    var name = "Peter";
    var sessionid = $("#sessionid").text(); 

   function preload() {
        game.load.image('ship','../Images/Schiff.svg');

        // establish Network Connection 
        network.addGameStartEventListener(handelGameStart);     // is called when the game starts
        network.addNewGameStateEventListener(handelGameState);  // is called when a new GameState arrives
        network.addScoreEventListener(handelScore);             // is called when new Score information are available
        network.addDisconnectEventListener(handelDisconnect);   // is called when a disconnect happend
        network.register(name, sessionid);                      // register the client at the server and join a session

        Panel.loadAllTypes(game)
    }
    
    function create () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        panel = new Panel(game,Panel.types.FISH, 0,100)
        panel = new Panel(game,Panel.types.FISH, 0,0)

        shipStripe = game.add.sprite(game.world.width, 80, 'ship');

        shipStripe.scale.setTo(0.9 , 0.9);
        //shipStripe.body.velocity.x = -1000;
        game.add.tween(shipStripe).to({x:-20}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);

    }

    function update(){

        if(game.input.mousePointer.isDown){
            panel.forEach(game.physics.moveTowardsMouse, game.physics, false, 200);
        }

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
