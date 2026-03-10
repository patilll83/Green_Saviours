const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");

router.get("/volunteer/dashboard", middleware.ensureVolenteerLoggedIn, async (req,res) => {
	const volunteerId = req.user._id;
	const notification = await Notification.find();
	
	res.render("volunteer/dashboard", {
		title: "Dashboard",
		notification
	});
});