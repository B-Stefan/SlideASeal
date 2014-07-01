exports.index = function(req, res) {

	var options = {
		sessionid: req.params.sessionid
	}
	res.render('test2', options);
} 