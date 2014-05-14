/**
 * Created by Besitzer on 14.05.2014.
 */

define(['phaser'],function (Phaser){
    var shipStripe;
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gamefield', { preload: preload, create: create, update: update }, true);

   function preload() {
        game.load.image('ship','../Images/Schiff.svg');
    }
    function create () {

        shipStripe = game.add.sprite(game.world.width, 80, 'ship');
        shipStripe.scale.setTo(0.9 , 0.9);
        game.physics.enable(shipStripe,Phaser.Physics.ARCADE);
        //shipStripe.body.velocity.x = -1000;
        game.add.tween(shipStripe).to({x:-20}, 5000, Phaser.Easing.Quadratic.Out, true, 0, false);

    }
    function update(){

    }


});
