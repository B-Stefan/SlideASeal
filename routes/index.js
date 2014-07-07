exports.index = function(req, res) {

	var options = {
		sessionid: req.params.sessionid
	}
	res.render('gamefield', options);
} 