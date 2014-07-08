randomData = require("./randomSessionIds.json")
exports.index = function (req, res) {

    sessionId = req.params.sessionid

    if (sessionId == null || sessionId == undefined)
    {
        sessionId = getRandomSessionID()
    }
    var options = {
        sessionid: sessionId
    }
    res.render('gamefield', options);

    function getRandomSessionID() {
        return randomData[Math.floor(Math.random()*randomData.length)]

    }
} 