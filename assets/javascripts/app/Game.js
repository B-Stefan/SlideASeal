/**
 * Created by Besitzer on 14.05.2014.
 */

define(['Phaser', './Panel'],function (Phaser, Panel){
    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update }, true);

   function preload() {
        game.load.image('ship','../Images/Schiff.svg');
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


});
