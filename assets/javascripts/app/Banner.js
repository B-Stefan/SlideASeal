define(['_'], function () {
    var game;

    function preload(inGame) {
        game = inGame;

        game.load.image('five-of-a-kind', game.normalizeUrl('/Images/banner/five-of-a-kind.png'));
        game.load.image('four-of-a-kind', game.normalizeUrl('/Images/banner/four-of-a-kind.png'));
        game.load.image('not-your-turn', game.normalizeUrl('/Images/banner/not-your-turn.png'));
        game.load.image('player-disconnected', game.normalizeUrl('/Images/banner/player-disconnected.png'));
        game.load.image('three-of-a-kind', game.normalizeUrl('/Images/banner/three-of-a-kind.png'));
        game.load.image('you-lose', game.normalizeUrl('/Images/banner/you-lose.png'));
        game.load.image('you-win', game.normalizeUrl('/Images/banner/you-win.png'));
        game.load.image('your-turn', game.normalizeUrl('/Images/banner/your-turn.png'));
    }

    function play(inType) {
        var banner = game.add.sprite(game.world.width/2, game.world.height/2, inType);
        banner.anchor.setTo(0.5, 0.5);
        banner.scale.setTo(0.3, 0.3);
        banner.alpha = 0;

        var bannertween = game.add.tween(banner.scale).to({x:0.5, y:0.5}, 1000, Phaser.Easing.Linear.None, true, 0, false);
        var bannertween1 = game.add.tween(banner).to({alpha:1 }, 1000, Phaser.Easing.Linear.None, true, 0, false);
                        
        bannertween.onComplete.add(function() {
            var bannertween2 = game.add.tween(banner.scale).to({x:0.3, y:0.3}, 1000, Phaser.Easing.Linear.None, true, 0, false);
            var bannertween3 = game.add.tween(banner).to({alpha:0 }, 1000, Phaser.Easing.Linear.None, true, 0, false);
            bannertween2.onComplete.add(function() {
                banner.destroy();
            }, this);
        }, this);
    }

    return {
        preload: preload,
        play: play
    };

});
