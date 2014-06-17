define(['Phaser'],function(Phaser){

    var Seal = function(game,x,y,side){
        this.game = game,
            this.x = x,
            this.y = y,
            this.side = side

        var robbe = game.add.sprite(this.y, this.x, 'RobbeRight') ;
        robbe.scale.set(0.3);
        var anim = robbe.animations.dd('walk');
        anim.play(10, false);

        this.getSide = function(){
            return this.player;
        };

        animation = function(time) {
            robbe.scale.set(0.28);
            delayed = function () {
                anim = robbe.animations.add('walk');
                anim.play(10, false);
            }
            window.setTimeout(delayed, time);
        }

        this.randomAnimation = function(){
            var random = (math.random())*10;
            robbe.destroy();
            if(random>5){
                if(this.side == 'right') {
                    robbe = game.add.sprite(this.y, this.x, 'RobbeClapRight');
                }else if (this.side == 'left'){
                    robbe = game.add.sprite(this.y, this.x, 'RobbeClapLeft');
                }
                animation(0);
            }else if (random<5){
                if(this.side == 'right') {
                    robbe = game.add.sprite(this.y, this.x, 'RobbeBallRight');
                }else if (this.side == 'left'){
                    robbe = game.add.sprite(this.y, this.x, 'RobbeBallLeft');
                }
                animation(0);
            }
        }

        this.changeSide = function(){
            //Es muss noch die Animation erzeugt werden zum verschwinden der Robbe (Poff)
            if(this.side == 'left'){
                this.side = 'right';
                //anderes Bild laden
                robbe.destroy();
                this.x = (game.world.width)-this.x;
                robbe = game.add.sprite(this.y, this.x, 'RobbeClapRight');
                animation(0);
            }
            if(this.side == 'right'){
                this.side = 'left';
                //anderes Bild laden
                robbe.destroy();
                this.x = (game.world.width)-this.x;
                robbe = game.add.sprite( this.y, this.x, 'RobbeClapLeft');
                animation(0);
            }
        }
    }

})