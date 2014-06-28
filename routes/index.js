exports.index = function(req, res) {

	var options = {
		sessionid: req.params.sessionid,
		registername: req.params.registername
	}
	res.render('test2', options);
} 