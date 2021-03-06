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
    function (Phaser, $, Panel, network, _, Gamefield, Scoreboard, Player, UpcomingPanelsBoard, SealBoard, Banner, Seal) {

        /**
         * @class
         * The game class for a new Slide a seal instance
         * @param {String} the id of the gamefield
         * @param {string} the name of the player
         */
        return SlideASealGame = function (gamefieldID,registername){
            var shipStripe;
            var game = new Phaser.Game(800, 600, Phaser.AUTO, gamefieldID, { preload: preload, create: create, update: update}, true);
            var gamefield;
            var upcomingPanelBoad;
            var scoreTable;

            //Set public var game
            this.game = game

            //Get Vars from server
            $("#registername").text(registername);
            var sessionid = $("#sessionid").text();


            //Define Class extension of the game
            game._SAS_currentPlayer = null
            game.getCurrentPlayer = function () {
                return game._SAS_currentPlayer
            }
            game.setCurrentPlayer = function (player) {
                game._SAS_currentPlayer = player
            }
            game.normalizeUrl = function (relativeUrl) {
                if (relativeUrl[0] != "/") {
                    relativeUrl = "/" + relativeUrl
                }
                return 'http://' + window.location.host + relativeUrl;
            }


            /**
             * Preload function from Phasers
             */
            function preload() {
                Panel.loadAllTypes(game)
                Banner.preload(game);
                Gamefield.preload(game)
                UpcomingPanelsBoard.preload(game)
                SealBoard.preload(game)
                Seal.preload(game)
                game.load.image('ship', game.normalizeUrl('/Images/Schiff.png'));
                game.load.image('shipBroken', game.normalizeUrl('/Images/SchiffAufgebrochen.png'));
                game.load.image('shipBrick', game.normalizeUrl('/Images/SchiffBrick.png'));

                game.load.audio("beach", game.normalizeUrl('/sounds/ambient/beach.ogg'), true);
                game.load.audio("icecrash", game.normalizeUrl('/sounds/ambient/icecrash.ogg'), true);
                game.load.audio("siren", game.normalizeUrl('/sounds/ambient/siren.ogg'), true);
            }

            /**
             * Create function from Phaser
             */
            function create() {
                shipStripe = game.add.sprite(game.world.width, -80, 'ship');    //Place Ship
                shipStripe.scale.setTo(0.5);                                    //Scale ship

                beachSound = game.sound.play("beach", 1, true);                 //Play background sound


                you = new Player(registername, registername)                    //Player instance
                gamefield = new Gamefield(game, you)                            //Gamefield, with contains the panels
                upcomingPanelBoad = new UpcomingPanelsBoard(game, gamefield)    //Next panels stack
                Scoreboard.create(game);                                        //Display the player points in the top coners


                network.addGameStartEventListener(handelGameStart);         // is called when the game starts
                network.addNewGameStateEventListener(handelGameState);      // is called when a new GameState arrives
                network.addScoreEventListener(handelScore);                 // is called when a new Score arrives
                network.addSlidePostionEventListener(handelSlidePostion);   // is called when the current slider move the current panel
                network.addNotificationEventListener(handelNotification);   // is called when a notification happend
                network.addDisconnectEventListener(handelDisconnect);       // is called when a disconnect happend
                network.register(registername, sessionid);                  // register the client at the server and join a session


                time = 5000
                shipTween = game.add.tween(shipStripe).to({x: -140}, time, Phaser.Easing.Quadratic.In, true, 0, false);
                game.add.tween(shipStripe.scale).to({x: 0.75, y: 0.75}, time, Phaser.Easing.Quadratic.In, true, 0, false);
                sirenSound = game.sound.play("siren", 0.5, false);


                /**
                 * Entrance animation
                 *
                 */
                var run = false
                if (run == false) {
                    shipTween.onComplete.add(function () {
                        shakeTween = game.add.tween(shipStripe).to({ x: -150 }, 100, Phaser.Easing.Quadratic.In, true, 1, 10).yoyo(true).loop().start();
                        icecrushSound = game.sound.play("icecrash", 1, false);

                        //If shake complete
                        shakeTween.onComplete.add(function () {

                            if (run == false) {
                                //Show broken ship
                                shipStripeBroken = game.add.sprite(shipStripe.x, shipStripe.y, 'shipBroken');
                                shipStripeBroken.scale.x = shipStripe.scale.x
                                shipStripeBroken.scale.y = shipStripe.scale.y
                                shipStripe.destroy()
                                shipStripe = shipStripeBroken
                                game.world.sendToBack(shipStripe)

                                shipStripeBick = game.add.sprite(shipStripe.x, shipStripe.y, 'shipBrick');
                                shipStripeBick.scale.x = shipStripe.scale.x
                                shipStripeBick.scale.y = shipStripe.scale.y

                                game.world.bringToTop(shipStripeBick)
                                shipStripeBickTween = game.add.tween(shipStripeBick).to({y: game.world.height + 100}, 3000)
                                shipStripeBickTween.onStart.add(function () {
                                    if (run == false) {
                                        run = true
                                        gamefield.show()
                                        game.add.tween(scoreTable).to({alpha: 1}, 1000);
                                        game.world.bringToTop(shipStripeBick)
                                    }
                                }, this)
                                run2 = false
                                shipStripeBickTween.onComplete.add(function () {
                                    if (run2 == false) {
                                        run2 = true
                                        $('#info').first().fadeIn()
                                        upcomingPanelBoad.show()
                                        Scoreboard.show();
                                    }
                                }, this)

                                if (run == false) {
                                    shipStripeBickTween.start()
                                }
                            }

                        }, this)

                    }, this)
                }

            }

            /**
             * Update Loop by Phaser
             */
            function update() {


            }

            /***
             *
             * Network sektion
             *
             */

            /**
             * Fires when the game starts (player 2 joined)
             * @param data - Data Object
             * @see Action.js
             */
            function handelGameStart(data) {
                console.log('!!! GameStart !!!');
                handelGameState(data)
            }

            /**
             * Fires if a player slide a Panel in the gamefield
             * @param data - Server Object
             * @see Action.js
             */
            function handelGameState(data) {
                $('#info').remove()
                $('#scoreboard').first().fadeIn()
                console.log('!!! New GameState !!!');
                console.log(data);
                console.log(data.actions[0])
                console.log("The next Panel is: " + data.nextPanels[0]);
                for (var i = 0; i < 5; i++) {
                    console.log("| " + data.field[i][0] + " | " + data.field[i][1] + " | " + data.field[i][2] + " | " + data.field[i][3] + " | " + data.field[i][4] + " |")
                    console.log("|---|---|---|---|---|")
                }

                if (gamefield.getSize() == 0) {
                    gamefield.createGamefield(data.field)
                }
                gamefield.handleNetworkGameState(data)
                upcomingPanelBoad.handleNetworkGameState(data)
            }


            /**
             * Fires if a player have 3 or more equal panels in the same row or col
             * @param data - Server Object
             * @see Action.js
             */
            function handelScore(data) {
                Scoreboard.updateScoreboard(data);
            }


            /**
             * Fires if the other player change the position of his new Panel (Hover effect)
             * @param data - Server Object
             * @see Action.js
             */
            function handelSlidePostion(data) {
                //console.log('!!! SlidePostion !!!');
                //console.log("m: " + data.m + ", n:" + data.n);
                gamefield.handleNetworkSlideNewPanelPosition(data)
            }


            /**
             * Fires if the a player leave, socre or somethink else
             * @param data - Server Object
             * @see Action.js
             */
            function handelNotification(data) {

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

            /**
             * Called if the other player Disconnect
             */
            function handelDisconnect() {
                console.log('!!! Disconnect !!!');
                Banner.play('player-disconnected');
            }
        }

    });
