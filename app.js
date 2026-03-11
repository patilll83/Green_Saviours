const express = require("express");
const app = express();
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const cors = require("cors");

const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const homeRoutes = require("./routes/home.js");
const authRoutes = require("./routes/auth.js");
const adminRoutes = require("./routes/admin.js");
const donorRoutes = require("./routes/donor.js");
const volunteerRoutes = require("./routes/volunteer.js");
require("dotenv").config();
require("./config/dbConnection.js")();
require("./config/passport.js")(passport);



app.set("view engine", "ejs");
app.use(expressLayouts);
app.use("/assets", express.static(__dirname + "/assets"));
// app.use("/public", express.static(__dirname + "/public"));

// app.use(express.static(__dirname+"public"));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
// app.use(cors);

const path = require('path')
app.set('views', path.join(__dirname, 'views'));

app.use(session({
	secret: process.env.SESSION_SECRET || "fallback_dev_secret",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(methodOverride("_method"));
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	res.locals.warning = req.flash("warning");
	next();
});



// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(donorRoutes);
app.use(adminRoutes);
app.use(volunteerRoutes);

// 404 Handler — must come AFTER all routes
app.use((req, res) => {
	res.status(404).render("404page", { title: "Page not found" });
});

// Global Error Handler — catches errors thrown by route handlers
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send("Something went wrong. Please try again later.");
});


const port = process.env.PORT || 5000;
app.listen(port, console.log(`Server is running at http://localhost:${port}`));
