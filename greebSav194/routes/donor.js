const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");

const Notification = require("../models/notification.js");
const Plant = require("../models/plant.js");
const Nursary = require("../models/nursary.js");
const Pic= require("../models/pic.js")
const multer  = require('multer')
const PlantationArea = require("../models/plantation_area.js");




const user = express();
const bodyParser = require('body-parser');

user.use(bodyParser.json());
user.use(bodyParser.urlencoded({ extended:false }));


const path = require('path');

// user.use(express.static('public'));
// user.use(express.static(__dirname+"public"));

const storage = multer.diskStorage({
    destination:function(req, file, cb){
        if(file.mimetype === 'image/jpeg' 
        || file.mimetype === 'image/png'|| file.mimetype === 'image/jpg'){
            cb(null,path.join(__dirname,'../assets/public/image'));
        }
       
    },
    filename:function(req,file,cb){
        const name = req.user._id+'_'+Date.now()+'-'+file.originalname;
        cb(null,name);
    }
});

const fileFilter = (req,file,cb) => {
    if (file.fieldname === "image") {
        (file.mimetype === 'image/jpeg' 
         || file.mimetype === 'image/png')
        ? cb(null,true)
        : cb(null,false);
    }
    
}

const upload = multer({
    storage:storage
    
}).single('avatar');

const PlantationVolunteer = require("../models/plantation_volunteer.js");
//router.post('/donor/upload',  middleware.ensureDonorLoggedIn, function (req, res, next) {
//	// console.log(req)
//});

router.get("/donor/upload_view_pic", middleware.ensureDonorLoggedIn, async (req,res) => {
	// const volunteerId = currentUser._id;
// alert(currentUser._id)
	console.log(req.user)

	Pic.find({}).exec(function(err,data){
		if(err) throw err;
	res.render('donor/upload_view_pic', { title: 'Upload/View pictures', records:data ,success:''});
	
	  });
});



router.post("/donor/upload", upload,middleware.ensureDonorLoggedIn,async (req,res) => {
	try {
		
  console.log(req);
  console.log("enter  2   ")
  var image_filename= req.file.filename;
  var image_path= req.file.path;
  var success= req.file.originalname+ " image uploaded successfully";

  var imageDetails= new Pic({volunteerId:req.user._id,firstName:req.user.firstName,img:image_filename,img_path:image_path});
  imageDetails.save(function(err,doc){
	if (err) throw err;

	

	Pic.find({volunteerId:req.user._id}).sort({time:-1}).exec(function(err,data){
		if(err) throw err;
		Pic.find({}).sort({time:-1}).exec(function(err,data){
			if(err) throw err;
			res.render('donor/upload_view_pic', { title: 'Upload/view File', records:data,   success:success });
			});
		
		});
		
  })   

    } catch (error) {
        res.status(400).send({ success:false, msg:error.message });
    }

});

router.get('/donor/show_pics', middleware.ensureDonorLoggedIn,function(req, res, next) {
	Pic.find({}).exec(function(err,data){
	  if(err) throw err;
  res.render('donor/show_pics', { title: 'Uploaded pictures', records:data });
	});
  });


  router.get("/donor/issues_plantation", middleware.ensureDonorLoggedIn, async (req,res) => {

	PlantationArea.find({}).exec(function(err,data){
		if(err) throw err;
		res.render("donor/issues_plantation", { title: "Add Plantation Area Issues",plantation:data});

	  });
	
});



router.get("/donor/dashboard", middleware.ensureDonorLoggedIn, async (req,res) => {
	const donorId = req.user._id;
	const notification = await Notification.find().populate("message").sort({added_date:-1});
// {message,added_date}notification;
//	console.log("notification="+notification)

console.log(notification.message);
	
	res.render("donor/dashboard", {
		title: "Dashboard",
		notification
	});
});

router.get("/donor/view_pics", middleware.ensureDonorLoggedIn, async (req,res) => {
	const donorId = req.user._id;
	const pics = await Uploaded_pics.find({_id:donorId});

	
	res.render("donor/view_myimages", {
		title: "My Images",
		pics
	});
});

router.get("/donor/nursary_details/view/:nursaryId", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		const nursaryId = req.params.nursaryId;
		const plants=await Plant.find();

		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		const nursary_details = await Nursary.find().where({group_id: nursaryId });
		const nursary_d = await Nursary.findById(nursaryId);

		console.log("nursary_d="+nursary_d)

	const numCount = await Nursary.countDocuments({ group_id: nursaryId });

//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("donor/single_nursary_details", { title: "Plants details in Nursery", nursary_details,plants,numCount ,nursary_d});
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/v_nursary_list", middleware.ensureDonorLoggedIn, async (req,res) => {

	try
	{
		const nursary = await Nursary.find({ "group_id": { $exists: false} });
 		res.render("donor/v_nursary_list", { title: "List of Nursery", nursary });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/workdone/previous", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		const previousWork = await PlantationVolunteer.find({ 
			volunteerId: req.user._id,  });

		console.log("q="+previousWork);
		res.render("donor/previousWork", { title: "Previous Workdone", previousWork });

	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/donate", middleware.ensureDonorLoggedIn, async(req,res) => {
	const agents = await User.find({ role: "agent"}).populate("lastName");
	const ngos = await User.find({ role: "ngo" }).populate("lastName");
	// res.render("donor/pendingDonations", { title: "Pending Donations", pendingDonations });
	// await User.findByIdAndUpdate(id, updateObj);

 


	res.render("donor/donate", { title: "Donate",ngos,agents });
});

router.post("/donor/save_issues_plantation", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		console.log("cc="+req.body);
		
// 

		// const newDonation = new Donation(donation);
		// await newDonation.save();
		// req.flash("success", "Plantation Issue sent successfully");
		// res.redirect("/donor/issues_plantation");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.post("/donor/donate", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		console.log("cc="+req.body.donation);
		const donation = req.body.donation;
		if(donation.agent!=""){
			donation.status = "assigned";
		}else{
			donation.status = "pending";
		}
		if(donation.agent!=""){
			donation.ngo_status = "assigned";
		}else{
			donation.ngo_status = "pending";
		}
		
		donation.donor = req.user._id;
		const newDonation = new Donation(donation);
		await newDonation.save();
		req.flash("success", "Donation request sent successfully");
		res.redirect("/donor/donations/pending");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/donations/pending", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		const pendingDonations = await Donation.find({ donor: req.user._id, status: ["pending", "rejected", "accepted", "assigned"] }).populate("agent");
		res.render("donor/pendingDonations", { title: "Pending Donations", pendingDonations });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/donations/previous", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		const previousDonations = await Donation.find({ donor: req.user._id, status: "collected" }).populate("agent");
		res.render("donor/previousDonations", { title: "Previous Donations", previousDonations });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/donation/deleteRejected/:donationId", async (req,res) => {
	try
	{
		const donationId = req.params.donationId;
		await Donation.findByIdAndDelete(donationId);
		res.redirect("/donor/donations/pending");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/donor/profile", middleware.ensureDonorLoggedIn, (req,res) => {
	res.render("donor/profile", { title: "My Profile" });
});

router.put("/donor/profile", middleware.ensureDonorLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.donor;	// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/donor/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;