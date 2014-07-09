define(['_', './Banner', './SealBoard', './Seal'], function (_, Banner, SealBoard, Seal) {


    /**
     * Text on the left side of the Game
     */
    var lefttext;

    /**
     * Text on the right side of the Game
     */
    var righttext;

    /**
     * Sealboard for the player on the left
     */
    var leftSealBoard;

    /**
     * Sealboard for the player of the right
     */
    var rightSealBoard;
    /**
     * Default total number of the seals (for both players, each player becomes numberOfSeals/2
     * @type {number}
     */
    var numberOfSealsTotal = 6;

    /**
     * Minimum than must have one player to change a seal side
     * @type {number}
     */
    var numberOfPointMinimumToChangeSeals = 200

    /**
     * Per 100 points difference one seal change side (The price of a Seal)
     * @type {number}
     */
    var numberOfPointsDifference = 100

    /**
     * The Game of the Sealboard
     * @type {Phaser.Game}
     */
    var game;

    /**
     * Loads sprites and other resources
     * @param {Phaser.Game} game2 - The game with the loader
     */
    function create(game2) {
        game = game2
        var text = "Player 1";
        var style = { font: "30px Arial", fill: "#ffffff", align: "left" };

        lefttext = game.add.text(15, 15, text, style);
        lefttext.anchor.setTo(0, 0);

        text = "Player 2";
        style = { font: "30px Arial", fill: "#ffffff", align: "right" };

        righttext = game.add.text(game.world.width - 15, 15, text, style);
        righttext.anchor.setTo(1, 0);

        leftSealBoard = new SealBoard(game, Seal.sides.LEFT)
        rightSealBoard = new SealBoard(game, Seal.sides.RIGHT)


    }

    /**
     * Update the sprites on screen and if necessary change seals
     * @param data
     */
    function updateScoreboard(data) {
        console.log('!!! Score !!!');
        console.log("you score is: " + data.you.score);
        console.log("rival score is: " + data.rival.score);
        console.log(data);

        if (data.you.side == "left") {
            lefttext.setText(data.you.name + "\n" + data.you.score);
            righttext.setText(data.rival.name + "\n" + data.rival.score);

        } else if (data.you.side == "right") {
            lefttext.setText(data.rival.name + "\n" + data.rival.score);
            righttext.setText(data.you.name + "\n" + data.you.score);
        }

        changeSealSide(data)

        yourSealBoard = getSealBoardBySide(data.you.side)
        rivalSealBoard = getSealBoardBySide(data.rival.side)

        if (yourSealBoard.getNumberOfSeals() == 0) {
            Banner.play("you-lose", false)
        }
        else if (rivalSealBoard.getNumberOfSeals() == 0) {
            Banner.play("you-win", false)
        }

    }

    /**
     * If the score difference between the two players > 60, one seal change the sides
     * @param {Action} data - The scroe data from Server
     * @see Gamefield.js
     */
    function changeSealSide(data) {


        yourScore = data.you.score
        rivalScore = data.rival.score

        /**
         * If you or the other less then numberOfPointMinimumToChangeSeals do nothing
         */
        if (!(yourScore > numberOfPointMinimumToChangeSeals || rivalScore > numberOfPointMinimumToChangeSeals)) {
            return;
        }

        difference = Math.abs(yourScore - rivalScore)

        numberOfSealsToAdd = Math.floor(difference / numberOfPointsDifference)              //Always round down
        newNumberOfSeals = numberOfSealsTotal / 2 + numberOfSealsToAdd

        //If you a good player
        if (yourScore > rivalScore) {
            side = data.you.side
        }
        //Other is better
        else {
            side = data.rival.side
        }


        //Get the right sealBoards
        if (side == "left") {
            sealBoard = leftSealBoard
            otherSealBoard = rightSealBoard;
        }
        else {
            sealBoard = rightSealBoard
            otherSealBoard = leftSealBoard;
        }

        tween = sealBoard.changeSealSide(newNumberOfSeals, otherSealBoard)



    }

    /**
     * Get the correct sealboard by the side
     * @param {String} side it can be "left" or "right"
     * @returns {SealBoard}
     */
    function getSealBoardBySide(side) {
        if (side == "left") {
            return leftSealBoard;
        } else if (side == "right") {
            return rightSealBoard;
        }
        throw new Error("Wrong side parameter")
    }

    /**
     * Change the seals for one  side
     * @param side
     */
    function changeSealsForOneSide(side, newNumberOfSeals) {

    }

    /**
     * Show the sealbaords with a litel delay
     */
    function show() {

        game.time.events.add(Phaser.Timer.SECOND * Math.random(), function () {
            leftSealBoard.show()
        }, this)
        game.time.events.add(Phaser.Timer.SECOND * Math.random(), function () {
            rightSealBoard.show()
        }, this)

    }


    /**
     * Return the module
     */
    return {
        create: create,
        show: show,
        updateScoreboard: updateScoreboard
    };

});
