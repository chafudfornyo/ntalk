module.exports = function(app) {

	var HomeController = {		
		index: function(req, res) {		
			res.render('home/index');
		},
		login: function(req, res) {
			
			var email = req.body.usuario.email;
			
			var nome = req.body.usuario.nome;

			if (email && nome) {

				var usuario = {
					nome : req.body.usuario.nome, 
					email: req.body.usuario.email,
					contatos : []				
				};
				req.session.usuario = usuario;
				res.redirect('/contatos');

			} else {
				res.redirect('/');
			}

		},

		logout: function(req, res) {
			req.session.destroy();
			res.redirect('/');
		}

	};

	return HomeController;
};

