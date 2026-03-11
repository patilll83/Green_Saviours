const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Notification = require("../models/notification.js");
const PlantationVolunteer = require("../models/plantation_volunteer.js");

// ─── Dashboard ───────────────────────────────────────────────────────────────
router.get("/volunteer/dashboard", middleware.ensureVolenteerLoggedIn, async (req, res) => {
	try {
		const notification = await Notification.find().sort({ added_date: -1 }).limit(5);
		const assignedPlantations = await PlantationVolunteer.find({ volunteerId: String(req.user._id) });
		res.render("volunteer/dashboard", {
			title: "Volunteer Dashboard",
			notification,
			assignedPlantations
		});
	} catch (err) {
		console.error(err);
		req.flash("error", "Something went wrong. Please try again.");
		res.redirect("/");
	}
});

// ─── Profile ─────────────────────────────────────────────────────────────────
router.get("/volunteer/profile", middleware.ensureVolenteerLoggedIn, async (req, res) => {
	try {
		const user = await User.findById(req.user._id);
		res.render("volunteer/profile", { title: "My Profile", user });
	} catch (err) {
		console.error(err);
		req.flash("error", "Could not load profile.");
		res.redirect("/volunteer/dashboard");
	}
});

router.post("/volunteer/profile", middleware.ensureVolenteerLoggedIn, async (req, res) => {
	try {
		const { firstName, lastName, phone, address, gender } = req.body;
		await User.findByIdAndUpdate(req.user._id, { firstName, lastName, phone, address, gender });
		req.flash("success", "Profile updated successfully!");
		res.redirect("/volunteer/profile");
	} catch (err) {
		console.error(err);
		req.flash("error", "Profile update failed.");
		res.redirect("/volunteer/profile");
	}
});

// ─── My Assigned Plantations ─────────────────────────────────────────────────
router.get("/volunteer/plantations", middleware.ensureVolenteerLoggedIn, async (req, res) => {
	try {
		const assignedPlantations = await PlantationVolunteer.find({ volunteerId: String(req.user._id) });
		res.render("volunteer/show_plantation_list", {
			title: "My Plantations",
			assignedPlantations
		});
	} catch (err) {
		console.error(err);
		req.flash("error", "Could not load plantations.");
		res.redirect("/volunteer/dashboard");
	}
});

module.exports = router;