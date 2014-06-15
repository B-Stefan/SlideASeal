define(['_'], function () {

    var lefttext;
    var righttext;

    function create(game) {
        var text = "Player 1";
        var style = { font: "30px Arial", fill: "#ffffff", align: "left" };

        lefttext = game.add.text(15, 15, text, style);
        lefttext.anchor.setTo(0, 0);

        text = "Player 2";
        style = { font: "30px Arial", fill: "#ffffff", align: "right" };

        righttext = game.add.text(game.world.width - 15, 15, text, style);
        righttext.anchor.setTo(1, 0);
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

    }

    return {
        create: create,
        updateScoreboard: updateScoreboard
    };

});
