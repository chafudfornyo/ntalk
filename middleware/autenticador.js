module.exports = function(req, res, next) {
	if (!req.session.usuario) {
		console.log('passou');
		return res.redirect('/');
	}
	return next();
};