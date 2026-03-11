const middleware = {
	ensureLoggedIn: (req, res, next) => {
		if(req.isAuthenticated()) {
			return next();
		}
		req.flash("warning", "Please log in first to continue");
		res.redirect("/auth/login");
	},

	ensureAdminLoggedIn: (req, res, next) => {
		if(req.isUnauthenticated()) {
			req.session.returnTo = req.originalUrl;
			req.flash("warning", "Please log in first to continue");
			return res.redirect("/auth/login");
		}
		if(req.user.role != "admin") {
			req.flash("warning", "This route is allowed for admin only!!");
			return res.redirect("back");
		}
		next();
	},

	ensureDonorLoggedIn: (req, res, next) => {
		if(req.isUnauthenticated()) {
			req.session.returnTo = req.originalUrl;
			req.flash("warning", "Please log in first to continue");
			return res.redirect("/auth/login");
		}
		if(req.user.role != "donor") {
			req.flash("warning", "This route is allowed for donor only!!");
			return res.redirect("back");
		}
		next();
	},

	ensureNgoLoggedIn: (req, res, next) => {
		if(req.isUnauthenticated()) {
			req.session.returnTo = req.originalUrl;
			req.flash("warning", "Please log in first to continue");
			return res.redirect("/auth/login");
		}
		if(req.user.role != "ngo") {
			req.flash("warning", "This route is allowed for NGO only!!");
			return res.redirect("back");
		}
		next();
	},

	ensureAgentLoggedIn: (req, res, next) => {
		if(req.isUnauthenticated()) {
			req.session.returnTo = req.originalUrl;
			req.flash("warning", "Please log in first to continue");
			return res.redirect("/auth/login");
		}
		if(req.user.role != "agent") {
			req.flash("warning", "This route is allowed for agent only!!");
			return res.redirect("back");
		}
		next();
	},

	// Accepts role "volunteer" only
	ensureVolenteerLoggedIn: (req, res, next) => {
		if(req.isUnauthenticated()) {
			req.session.returnTo = req.originalUrl;
			req.flash("warning", "Please log in first to continue");
			return res.redirect("/auth/login");
		}
		if(req.user.role != "volunteer") {
			req.flash("warning", "This route is allowed for volunteers only!!");
			return res.redirect("back");
		}
		next();
	},

	ensureNotLoggedIn: (req, res, next) => {
		if(req.isAuthenticated()) {
			// Redirect to the correct dashboard based on role
			const dashboards = {
				admin:     "/admin/dashboard",
				volunteer: "/volunteer/dashboard",
				donor:     "/donor/dashboard",
				agent:     "/agent/dashboard",
				ngo:       "/ngo/dashboard",
			};
			const dest = dashboards[req.user.role] || "/";
			req.flash("warning", "Please logout first to continue");
			return res.redirect(dest);
		}
		next();
	}

}

module.exports = middleware;