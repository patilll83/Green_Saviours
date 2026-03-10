const express = require("express");
const router = express.Router();

router.get("/", (req,res) => {
	res.render("welcome1");
});



router.get("/home/about-us", (req,res) => {
	res.render("home/aboutUs", { title: "About Us | Food Aid" });
});

router.get("/home/mission", (req,res) => {
	res.render("initiatives", { title: "Our Initiatives" });
});

router.get("/home/contact-us", (req,res) => {
	res.render("home/contactUs", { title: "Contact us | Food Aid" });
});

router.get("/home/home1", (req,res) => {
	res.render("home/home1", { title: "HOME1" });
});


module.exports = router;