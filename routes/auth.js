const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user.js");
const passport = require("passport");
const random_string = require("randomstring");
const nodemailer = require("nodemailer");


const middleware = require("../middleware/index.js")

router.get("/auth/email_verify", middleware.ensureNotLoggedIn, (req,res) => {
	res.render("auth/email_verify", { title: "User Signup" });
});

router.get("/auth/signup", middleware.ensureNotLoggedIn, (req,res) => {
	res.render("auth/signup", { title: "User Signup" });
});

router.post("/auth/signup", middleware.ensureNotLoggedIn, async (req,res) => {
	
	const { firstName, lastName, email, password1, password2, role } = req.body;
	let errors = [];
	
	if (!firstName || !lastName || !email || !password1 || !password2) {
		errors.push({ msg: "Please fill in all the fields" });
	}
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (email && !emailRegex.test(email)) {
		errors.push({ msg: "Please enter a valid email address" });
	}
	if (password1 != password2) {
		errors.push({ msg: "Passwords are not matching" });
	}
	if (password1 && password1.length < 4) {
		errors.push({ msg: "Password length should be atleast 4 characters" });
	}
	if(errors.length > 0) {
		return res.render("auth/signup", {
			title: "User Signup",
			errors, firstName, lastName, email, password1, password2
		});
	}
	
	try
	{
		const user = await User.findOne({ email: email });
		if(user)
		{
			errors.push({msg: "This Email is already registered. Please try another email."});
			return res.render("auth/signup", {
				title: "User Signup",
				firstName, lastName, errors, email, password1, password2
			});
		}

		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(password1, salt);

		// ── Admin requires email confirmation before access ──
		if (role === 'admin') {
			const confirmToken = random_string.generate(32);
			const newUser = new User({
				firstName, lastName, email,
				password: hash, role,
				isVerified: false,
				token: confirmToken
			});
			await newUser.save();

			// Send confirmation email
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: { user: process.env.MY_SECRET_EMAILID, pass: process.env.MY_SECRET_PASSWORD }
			});
			await transporter.sendMail({
				from: `"Green Saviours" <${process.env.MY_SECRET_EMAILID}>`,
				to: process.env.MY_SECRET_EMAILID, // SEND TO MAIN ADMIN!
				subject: '⚠️ Admin Approval Request — Green Saviours',
				html: `
					<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
						<div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:24px;text-align:center">
							<h2 style="color:#fff;margin:0">🌿 Green Saviours</h2>
						</div>
						<div style="padding:32px">
							<h3 style="color:#2e7d32">New Admin Registration Request</h3>
							<p style="color:#444;line-height:1.6">
								A new user has registered and requested <strong>Admin</strong> access.
								<br><br>
								<strong>Name:</strong> ${firstName} ${lastName}<br>
								<strong>Email:</strong> ${email}
							</p>
							<p style="color:#444;line-height:1.6">To authorize this user and grant them Admin access, click the button below:</p>
							<div style="text-align:center;margin:32px 0">
								<a href="${process.env.BASE_URL}/auth/confirm-admin/${confirmToken}" style="background:linear-gradient(135deg,#2e7d32,#43a047);color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px">✅ Authorize Admin</a>
							</div>
							<p style="color:#888;font-size:12px">If you do not recognize this user, simply ignore this email. They will not be granted access.</p>
						</div>
						<div style="background:#f5f5f5;padding:12px;text-align:center">
							<p style="color:#999;font-size:12px;margin:0">Green Saviours — Planting a better tomorrow 🌱</p>
						</div>
					</div>`
			});

			req.flash("success", "Registration successful! Your admin account is pending authorization by the main administrator. You can log in once approved.");
			return res.redirect("/auth/login");
		}

		// ── All other roles: register and log in immediately ──
		const newUser = new User({ firstName, lastName, email, password: hash, role });
		await newUser.save();
		req.flash("success", "You are successfully registered and can log in.");
		res.redirect("/auth/login");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}

});

// ── Admin Account Confirmation via Email Link (Clicked by Main Admin) ──────────
router.get("/auth/confirm-admin/:token", async (req, res) => {
	try {
		const token = req.params.token;
		const user = await User.findOne({ token: token, role: 'admin', isVerified: false });

		if (!user) {
			req.flash("error", "Authorization link is invalid or already used.");
			return res.redirect("/auth/login");
		}

		await User.findByIdAndUpdate(user._id, { isVerified: true, token: '' });
		req.flash("success", `Success! You have authorized the admin account for ${user.firstName} ${user.lastName}.`);
		res.redirect("/auth/login");
	} catch (err) {
		console.log(err);
		req.flash("error", "Something went wrong. Please try again.");
		res.redirect("/auth/login");
	}
});

router.get("/auth/login", middleware.ensureNotLoggedIn, (req,res) => {
	res.render("auth/login", { title: "User login" });
});

router.get("/auth/forgot_password", middleware.ensureNotLoggedIn, (req,res) => {

	res.render("auth/forgot_password", { title: "Reset Password" });
});

router.post("/auth/verify_mail", middleware.ensureNotLoggedIn,
async (req,res)=>{
	let errors = [];
	const email= req.body.email_reset;


	try{
			
			const user = await User.findOne({ email: email });
			if(user)
			{
							  errors.push({msg: "This Email is already registered. Enter another Email."});
							req.flash("Failed", " This Email is already registered !!");
							// alert("This Email is already registered !!")
				return res.render("auth/email_verify", {
					title: "User Signup",
					 errors
				});
			}else{
	
	

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			  user: process.env.MY_SECRET_EMAILID,
			  pass: process.env.MY_SECRET_PASSWORD,
			},
		  });


		  let mailOptions = {
			from: `"Green Saviours" <${process.env.MY_SECRET_EMAILID}>`,
			to: email,
			subject: '✅ Email Verified — Green Saviours',
			html: `
				<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
					<div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:24px;text-align:center">
						<h2 style="color:#fff;margin:0">🌿 Green Saviours</h2>
					</div>
					<div style="padding:32px">
						<h3 style="color:#2e7d32">Email Verified!</h3>
						<p style="color:#444;line-height:1.6">Your email address has been verified successfully. You can now register and join our mission to make the Earth greener!</p>
						<div style="text-align:center;margin:32px 0">
							<a href="${process.env.BASE_URL}/auth/signup" style="background:linear-gradient(135deg,#2e7d32,#43a047);color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px">Register Now</a>
						</div>
						<p style="color:#888;font-size:12px">If you did not request this, please ignore this email.</p>
					</div>
					<div style="background:#f5f5f5;padding:12px;text-align:center">
						<p style="color:#999;font-size:12px;margin:0">Green Saviours — Planting a better tomorrow 🌱</p>
					</div>
				</div>`
			};

			transporter.sendMail(mailOptions, function (err1, info) {
				if (err1) {
				  res.json("err="+err1);
				  req.flash("Failed", "Please enter valid email id !!");
				  res.redirect("/auth/email_verify");
				} else {
				  console.log("Email Sent: " + info.response)
		
				

				req.flash("success", "Please check Your Mail, Email is sent !!");
		res.redirect("/auth/forgot_password");


				}
			  });


			}
			// else{
			// 	errors.push({msg: "This Email is not registered. Enter Correct Email."});
			// 	return res.render("auth/forgot_password", {
			// 		title: "Forgot Password",
			// 		 errors, email
			// 	});
			// }
	}catch(err){
		console.log(err.message)
	}
}
);



router.post("/auth/password_reset_mail", middleware.ensureNotLoggedIn,
async (req,res)=>{
	let errors = [];
	const email= req.body.email_reset;


	try{
			
			const user = await User.findOne({ email: email });
			if(user)
			{
		const randomString=random_string.generate();
		const updated_data=await User.updateOne({email:email},{$set:{token:randomString}});
	
	

		let transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
			  user: process.env.MY_SECRET_EMAILID,
			  pass: process.env.MY_SECRET_PASSWORD,
			},
		  });


		  let mailOptions = {
			from: `"Green Saviours" <${process.env.MY_SECRET_EMAILID}>`,
			to: email,
			subject: '🔐 Reset Your Password — Green Saviours',
			html: `
				<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;border:1px solid #e0e0e0;border-radius:8px;overflow:hidden">
					<div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:24px;text-align:center">
						<h2 style="color:#fff;margin:0">🌿 Green Saviours</h2>
					</div>
					<div style="padding:32px">
						<h3 style="color:#2e7d32">Hi ${user.firstName},</h3>
						<p style="color:#444;line-height:1.6">We received a request to reset your password. Click the button below to set a new password. This link is valid for a limited time.</p>
						<div style="text-align:center;margin:32px 0">
							<a href="${process.env.BASE_URL}/auth/reset_password/token/${randomString}" style="background:linear-gradient(135deg,#2e7d32,#43a047);color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px">Reset Password</a>
						</div>
						<p style="color:#888;font-size:12px">If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
					</div>
					<div style="background:#f5f5f5;padding:12px;text-align:center">
						<p style="color:#999;font-size:12px;margin:0">Green Saviours — Planting a better tomorrow 🌱</p>
					</div>
				</div>`
			};

			transporter.sendMail(mailOptions, function (err1, info) {
				if (err1) {
				  res.json("err="+err1);
				} else {
				  console.log("Email Sent: " + info.response)
		
				

				req.flash("success", "Please check Your Mail, Email is sent !!");
		res.redirect("/auth/forgot_password");


				}
			  });


			}
			else{
				errors.push({msg: "This Email is not registered. Enter Correct Email."});
				return res.render("auth/forgot_password", {
					title: "Forgot Password",
					 errors, email
				});
			}
	}catch(err){
		console.log(err.message)
	}
}
);


router.post("/auth/reset_password/post",  async (req,res) => {
	
	try
	{

		const token=req.body.token;


		const tokenData = await User.findOne({ token: token });

		if(tokenData){
const password= req.body.password;
const hashpassword= await bcrypt.hash(password,10);
const updated_data= await User.findByIdAndUpdate({_id:tokenData._id},{$set:{password:hashpassword,token:''}})
			
			req.flash("success", "New Password is reset successfully");
			res.redirect("/auth/login");
			

		}else{
			req.flash("error", "Token is invalid");
			res.redirect("/auth/login");
		}


		
	

	
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});


router.get("/auth/reset_password/token/:token", (req,res) => {

	const token = req.params.token;

	


	res.render("auth/reset_password", { title: "Reset Password ", token});

});

router.post("/auth/login", middleware.ensureNotLoggedIn,
	passport.authenticate('local', {
		failureRedirect: "/auth/login",
		failureFlash: true,
		successFlash: true
	}), async (req, res) => {
		// Block unverified admin accounts
		if (req.user.role === 'admin' && !req.user.isVerified) {
			req.logout((err) => {
				if (err) console.error(err);
				req.flash("warning", "⚠️ Your admin account is not yet confirmed. Please check your email and click the confirmation link.");
				res.redirect("/auth/login");
			});
			return;
		}
		res.redirect(req.session.returnTo || `/${req.user.role}/dashboard`);
	}
);

router.get("/auth/logout", (req, res) => {
	req.logout((err) => {
		if (err) console.error(err);
		req.flash("success", "Logged-out successfully");
		res.redirect("/");
	});
});


module.exports = router;