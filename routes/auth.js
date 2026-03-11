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
		
		const newUser = new User({ firstName, lastName, email, password:password1, role });
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(newUser.password, salt);
		newUser.password = hash;
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
			from: process.env.MY_SECRET_EMAILID,
			to:email,
			subject:'Verify Email',
			html:'hello your Email Id is verified. please click here to register <a href="http://localhost:5000/auth/signup"> REGISTER  </a>'
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
			from: process.env.MY_SECRET_EMAILID,
			to:email,
			subject:'Reset Password',
			html:'hello '+user.firstName+' please click here to reset password  <a href="http://localhost:5000/auth/reset_password/token/'+randomString+'"> reset password   </a>'
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
	}), (req,res) => {

		res.redirect(req.session.returnTo || `/${req.user.role}/dashboard`);
	}
);

router.get("/auth/logout", (req,res) => {
	req.logout();
	req.flash("success", "Logged-out successfully")
	res.redirect("/");
});


module.exports = router;