require({
    //urlArgs: "b=" + ((new Date()).getTime()),
    paths: {
        jquery: 'vendor/jquery/jquery',
        Phaser: 'vendor/phaser/phaser',
        '_': 'vendor/underscore/underscore'
    },
    shim: {
        Phaser: {
            exports: 'Phaser'
        },
        '_': {
            exports: '_'
        }
    }
});

define(['jquery', 'app/Game'], function ($, Game) {

    Array.prototype.removeByValue = function (val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === val) {
                this.splice(i, 1);
                i--;
            }
        }
        return this;
    }

    $(document).ready(function () {


        /**
         * Async get the name of the player
         * @type {jQuery.Deferred}
         */
        var dfr = new jQuery.Deferred()

        /**
         * Popup to aks the users name
         * @type {*|HTMLElement}
         */
        var $askPlayerName = $('#askPlayerName')
        $askPlayerName.getPlayerName = function(){
            return $(this).find("input").val()
        }

        playerName = $askPlayerName.getPlayerName()
        /**
         * No Player name from server set
         */
        if(playerName.trim() == "" ){
            $askPlayerName.fadeIn()
            $askPlayerName.find("button[type=submit]").one("click",function(){
                $askPlayerName.fadeOut()
                dfr.resolve($askPlayerName.getPlayerName())

            })
        }

        /**
         * If Player submit a valid name
         */
        dfr.done(function (planerName) {

            /**
             * Main game
             * @type {app.Game}
             */
            slideASeal = new Game('gamefield',planerName)

            /**
             * set Game link in info windows
             */
            $("#gamelink").val("http://" + window.location.host + "/" + $("#sessionid").text());

            /**
             * Info box select complete url if click
             */
            $("#info").find("input").click(function () {
                $(this).select();
            });

            /**
             * Vido function
             */

            /**
             * Play on click
             */
            $("#open-instruction").click(function () {
                $("#instruction").fadeIn("slow");
                $("#instruction-video")[0].play();

            });

            /**
             * stop on click
             */
            $("#instruction").click(function () {
                $("#instruction").fadeOut("slow");
                $("#instruction-video")[0].pause();
            });


            /**
             * Mute Btn
             */
            $('#mute').click(function () {
                if ($(this).text() == "Mute") {
                    slideASeal.game.sound.volume = 0;
                    $(this).text("Unmute");
                } else {
                    slideASeal.game.sound.volume = 1;
                    $(this).text("Mute");
                }
            });

        });
    });


});