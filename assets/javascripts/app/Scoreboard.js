define(['_', './Banner', './SealBoard', './Seal'], function (_, Banner,SealBoard,Seal) {

    var lefttext;
    var righttext;
    var leftSealBoard;
    var rightSealBoard;
    var numberOfSealsTotal = 6;
    var game;


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

        leftSealBoard = new SealBoard(game,Seal.sides.LEFT)
        rightSealBoard = new SealBoard(game,Seal.sides.RIGHT)
        window.test = {
            left: leftSealBoard,
            right: rightSealBoard
        }

    }

    function updateScoreboard(data) {
        console.log('!!! Score !!!');
        console.log("you score is: " + data.you.score);
        console.log("rival score is: " + data.rival.score);
        console.log(data);

        if(data.you.side == "left") {
            lefttext.setText(data.you.name + "\n" + data.you.score);
            righttext.setText(data.rival.name + "\n" + data.rival.score);

        } else if(data.you.side == "right") {
            lefttext.setText(data.rival.name + "\n" + data.rival.score);
            righttext.setText(data.you.name + "\n" + data.you.score);
        }

        changeSealSide(data)

    }

    /**
     * If the score difference between the two players > 60, one seal change the sides
     */
    function changeSealSide(data){


        yourScore = data.you.score
        otherScore = data.rival.score

        difference = Math.abs(yourScore-otherScore)

        numberOfSealsToAdd = Math.floor(difference/60)              //Always round down
        newNumberOfSeals = numberOfSealsTotal/2+numberOfSealsToAdd

        //If you a good player
        if(yourScore > otherScore){
           side = data.you.side
        }
        //Other is better
        else{
            side = data.rival.side
        }


        //Get the right sealBoards
        if(side == "left"){
            sealBoard       = leftSealBoard
            otherSealBoard  = rightSealBoard;
        }
        else{
            sealBoard       = rightSealBoard
            otherSealBoard  = leftSealBoard;
        }

        console.log("ScoreSealChange ",newNumberOfSeals)


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
    function show(){
        game.time.events.add(Phaser.Timer.SECOND * Math.random(), function(){
            leftSealBoard.show()
        },this)
        game.time.events.add(Phaser.Timer.SECOND * Math.random(), function(){
            rightSealBoard.show()
        },this)

    }
    return {
        create: create,
        show: show,
        updateScoreboard: updateScoreboard
    };

});
