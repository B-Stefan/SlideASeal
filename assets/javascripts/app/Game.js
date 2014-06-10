/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser', 'jquery', './Panel', 'network', '_', 'app/Gamefield', 'app/NextPanelIndikator'],function (Phaser, $, Panel, network, _,Gamefield, NextPanelIndikator){
    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update}, true);
    var name = "Peter";

    var gamefield,
        panelindikator;

    var sessionid = $("#sessionid").text();         // in the future parsed from the dom 



   function preload() {
        game.load.image('ship','../Images/Schiff.svg');

        // establish Network Connection 
        network.addGameStartEventListener(handelGameStart);     // is called when the game starts
        network.addNewGameStateEventListener(handelGameState);  // is called when a new GameState arrives
        network.addScoreEventListener(handelScore);             // is called when new Score information are available
        network.addDisconnectEventListener(handelDisconnect);   // is called when a disconnect happend
        network.register(name, sessionid);                      // register the client at the server and join a session

        game.load.image('NextPanelIndikator','../Images/nip.png');
        Panel.loadAllTypes(game)

        game.load.spritesheet('Robbe', '../Images/Robbe.png', 520, 520, 17);
        game.load.spritesheet('Robbe2', '../Images/RobbeBall.png', 520, 520, 18);
    }
    
    function create () {
        game.physics.startSystem(Phaser.Physics.P2JS);
        shipStripe = game.add.sprite(game.world.width, 80, 'ship');
        gamefield = new Gamefield(game)
        panelindikator = new NextPanelIndikator(game);

        //gamefield.enableBodyDebug = true;
        test3 = game.add.sprite(300, 180, 'Panel_Background');

        game.physics.p2.restitution = 0.0;
        game.physics.p2.gravity.y = 300;
        window.test = gamefield
        setTimeout(gamefield.testFunction,1000)
        //test = gamefield.children[0].getBackgroundSprite()
        //test2 = gamefield.children[1].getBackgroundSprite()

        game.physics.p2.enable(gamefield,true,true)

        shipStripe.scale.setTo(0.9 , 0.9);
        game.add.tween(shipStripe).to({x:-20}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);
        robbe_eins = game.add.sprite(630, 400, 'Robbe');
        robbe = game.add.sprite(600, 430, 'Robbe2');

        robbe.scale.set(0.3);
        robbe_eins.scale.set(0.28);
        anim = robbe.animations.add('walk');
        anim.play( 13, true );
        anim_eins = robbe_eins.animations.add('walk');
        anim_eins.play( 10, true );
        anim = robbe.animations.add('walk');
        anim.play( 13, true );
    }

    function update(){
        panelindikator.update();
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
        panelindikator.setNextPanels(data.nextPanels);
    }

   // handel Score
    function handelScore(data){
        console.log('!!! Score !!!');
        console.log("you score is: " + data.you.score);
        console.log("rival score is: " + data.rival.score);
    }

    // handel Disconnect
    function handelDisconnect(){
        console.log('!!! Disconnect !!!');
    }

});
