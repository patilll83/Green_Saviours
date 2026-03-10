const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Plant = require("../models/plant.js");
const Nursary = require("../models/nursary.js");
const Notification = require("../models/notification.js");
const PlantationArea = require("../models/plantation_area.js");
const PlantationPlants = require("../models/plantation_plants.js");
const Pic= require("../models/pic.js")


var nodemailer = require("nodemailer");
const PlantationVolunteer = require("../models/plantation_volunteer.js");

router.get("/admin/dashboard", middleware.ensureAdminLoggedIn, async (req,res) => {
	const numVolunteer = await User.countDocuments({ role: "volunteer" });
	res.render("admin/dashboard", {
		title: "Dashboard",numVolunteer
	});
});

router.get("/admin/gallery", middleware.ensureAdminLoggedIn, async (req,res) => {

	Pic.find({}).exec(function(err,data){
		if(err) throw err;
	res.render('admin/gallery', { title: 'Gallery', records:data });
	  });

});
router.get('/donor/show_pics', middleware.ensureDonorLoggedIn,function(req, res, next) {
	Pic.find({}).exec(function(err,data){
	  if(err) throw err;
  res.render('donor/show_pics', { title: 'Uploaded pictures', records:data });
	});
  });

// router.get("/admin/donations/pending", middleware.ensureAdminLoggedIn, async (req,res) => {
router.get("/admin/show_plant", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		const plants = await Plant.find();
 		res.render("admin/show_plant", { title: "List of plants", plants });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/show_notification", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		const notification = await Notification.find().sort({ added_date: 'desc' });
 		res.render("admin/show_notification", { title: "List of Notification", notification });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/show_nursary_details", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		
		const nursary = await Nursary.find({ "group_id": { $exists: false} });
 		res.render("admin/show_nursary_details", { title: "List of Nursery", nursary });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/show_plantation_list", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		
		const plantation = await PlantationArea.find();
 		res.render("admin/show_plantation_list", { title: "List of Plantation", plantation });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});
router.get("/admin/show_plantation_list_volunteer", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		
		const plantation = await PlantationArea.find();
 		res.render("admin/show_plantation_list_volunteer", { title: "List of Plantation", plantation });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});
router.get("/admin/add_nursary_plants", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
		const nursary = await Nursary.find();
 		res.render("admin/add_nursary_plants", { title: "Nursery Details", nursary });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/add_new_nursary", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
 		res.render("admin/add_new_nursary", { title: "Add New Nursery"});
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});
router.get("/admin/add_notification", middleware.ensureAdminLoggedIn, async (req,res) => {

	try
	{
 		res.render("admin/add_notification", { title: "Add Notification"});
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/previous_work_volunteer/view/:volunteerId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const volunteerId = req.params.volunteerId;
		

		const volunteer_workdone = await PlantationVolunteer.find({volunteerId:volunteerId})
	
		console.log("PlantationVolunteer aa ="+volunteer_workdone);
	//	res.status(200).json(aa);
	//const numCount = await Nursary.countDocuments({ group_id: nursaryId });
//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_volunteer_workdone", { title: "Add Volunteers Work Done",volunteer_workdone });
		// res.render("admin/single_plantation_details_volunteer", { title: "Add Volunteers",aa, plantationArea,plantationId,volunteers,plantation_Volunteer });

	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});


router.get("/admin/single_plantation_details_volunteer/add_volunteers/:plantationId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const plantationId = req.params.plantationId;
		
		const volunteers=await User.find({role:"donor"});
		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		// const plantationArea = await PlantationArea.find().where({_id: plantationId });
		const plantationArea = await PlantationArea.findById(plantationId);
		const plantation_Volunteer  = await PlantationVolunteer.find({plantation_id: plantationId });	
		
		

		console.log("PlantationVolunteer="+volunteers)
	//const numCount = await Nursary.countDocuments({ group_id: nursaryId });
//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_plantation_details_volunteer", { title: "Add Volunteers", plantationArea,plantationId,volunteers,plantation_Volunteer });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/plantation_details_volunteer/delete/:plantationId/:volunteerId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const volunteerId = req.params.volunteerId;
		const plantationId = req.params.plantationId;

		const volunteers=await User.find({role:"donor"});

		

		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		// const nursary_details = await PlantationPlants.find().where({group_id: nursaryId });
		// const PlantationPlants_1 = await PlantationArea.find().where({plantation_id: null });

		await PlantationVolunteer.deleteOne({ _id: volunteerId,plantation_id: plantationId });
	const numCount = await PlantationVolunteer.countDocuments({ plantation_id: plantationId });
		 const plantation_Volunteer = await PlantationVolunteer.find().where({plantation_id: plantationId });
		 const plantationArea=  await PlantationArea.find({ plantation_id: plantationId });


//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_plantation_details_volunteer", { title: "Plantation details ",plantationArea,plantationId, plantation_Volunteer,numCount,volunteers });
		// res.redirect("back");
	}
	catch(err)
	{
		console.log(err);
		//req.flash("error", "Some error occurred on the server.")
		req.flash("-", "volunteer deleted successfully !!")

		res.redirect("back");
	}
});


router.post("/admin/add_volunteers_to_plantation",  async (req,res) => {
	
	try
	{		
	
		const plantation_name = req.body.plantation_name;	
		const plantation_id = req.body.plantation_id;	
		const caretaker = req.body.caretaker;	
		const address = req.body.address;	
		const phone = req.body.phone;	

		var newPl=0;

		const pl_de = req.body.pl_de;	

		console.log("pl_de="+pl_de);
		const myArray = pl_de.split("<====>");
		const arrLen=myArray.length;


		var aa=0;
		var bb=0;
		var json_d="";
		var arrLen_bb=0;



		for(var j=0;j<arrLen-1;j++)
		{
			aa=myArray[j].toString();
			bb=aa.split("<==>");

		console.log("json_d="+json_d);
		newPl = new PlantationVolunteer({  name: bb[0],volunteerId:bb[1],added_date:bb[2],
			plantation_id:plantation_id ,plantation_name:plantation_name});
						await newPl.save();

					}



		// res.json(newPl)
		req.flash("success", "Data saved successfully");
		// res.redirect("/admin/add_plant_to_plantation");
		res.redirect(`/admin/single_plantation_details_volunteer/add_volunteers/${plantation_id}`);
		

		
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});




router.get("/admin/nursary_details/view/:nursaryId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const nursaryId = req.params.nursaryId;
		const plants=await Plant.find();

		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		const nursary_details = await Nursary.find().where({group_id: nursaryId });
		const nursary_d = await Nursary.findById(nursaryId);

		//console.log("nursary_d="+nursary_d)

	const numCount = await Nursary.countDocuments({ group_id: nursaryId });

//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_nursary_details", { title: "Plants details in Nursery", nursary_details,plants,numCount ,nursary_d});
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/admin/nursary_details/delete/:gpid/:nursaryId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const nursaryId = req.params.nursaryId;
		const plants=await Plant.find();

		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		const nursary_details = await Nursary.find().where({group_id: nursaryId });
		const nursary_d = await Nursary.find().where({group_id: null });

		await Nursary.deleteOne({ _id: nursaryId });
	const numCount = await Nursary.countDocuments({ group_id: gpid });

//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_nursary_details", { title: "Plants details in Nursery", nursary_details,plants,numCount,nursary_d });
		// res.redirect("back");
	}
	catch(err)
	{
		console.log(err);
		//req.flash("error", "Some error occurred on the server.")
		req.flash("-", "plant deleted successfully !!")

		res.redirect("back");
	}
});



// router.get("/admin/plantation_details/delete/:plantationId/:plantId", middleware.ensureAdminLoggedIn, async (req,res) => {
	router.get("/admin/plantationPlants/delete/:plantationId/:plantId", middleware.ensureAdminLoggedIn, async (req,res) => {
	
try
	{
		const plantId = req.params.plantId;
		const plantationId = req.params.plantationId;

		const plants=await Plant.find();

		
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		// const nursary_details = await PlantationPlants.find().where({group_id: nursaryId });
		 const plantationArea  = await PlantationArea.find({plantation_id: plantationId});

		await PlantationPlants.deleteOne({ _id: plantId,plantation_id: plantationId });
	const numCount = await PlantationPlants.countDocuments({ plantation_id: plantationId });
		 const plantationPlants = await PlantationPlants.find().where({plantation_id: plantationId });


//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_plantation_details", { title: "Plants details ", plantationArea,plantationId,plants,numCount,plantationPlants });
		// res.redirect("back");
	}
	catch(err)
	{
		console.log(err);
		//req.flash("error", "Some error occurred on the server.")
		req.flash("-", "plant deleted successfully !!")

		res.redirect("back");
	}
});



router.get("/admin/add_plant", middleware.ensureAdminLoggedIn,  (req,res) => {
	

	res.render("admin/add_plant", {
		title: "add_plant"
	});
});


router.post("/admin/add_plant_1",  async (req,res) => {
	console.log("h1")
	try
	{
		console.log("h2")
		const body = req.body;
		console.log("body="+body);
		//const plant = req.body.p_name;	
		// const newPlant = new Plant(body);
		// console.log(newPlant);
		// await newPlant.save();

	const { p_name } = req.body;


		const newPlant = new Plant({ name:p_name});		
		await newPlant.save();

	//	res.json(newPlant)
		req.flash("success", "Data saved successfully");
		res.redirect("/admin/add_plant");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});


router.post("/admin/xxx",  async (req,res) => {
	
	try
	{		
	
		const plantation_name = req.body.plantation_name;	
		const plantation_id = req.body.plantation_id;	
		const caretaker = req.body.caretaker;	
		const address = req.body.address;	
		const phone = req.body.phone;	

		const pl_de = req.body.pl_de;	

		console.log("pl_de="+pl_de);
		const myArray = pl_de.split("<====>");
		const arrLen=myArray.length;

		var aa=0;
		var bb=0;
		var json_d="";
		var arrLen_bb=0;



		for(var j=0;j<arrLen-1;j++)
		{
			aa=myArray[j].toString();
			bb=aa.split("<==>");
			
if(j==(arrLen-2)){
	json_d=json_d+"{plant:'"+bb[0]+"',qty:"+bb[1]+",added_date:'"+bb[2]+"'}";

}else{
	json_d=json_d+"{plant:'"+bb[0]+"',qty:"+bb[1]+"',added_date:'"+bb[2]+"'},";

}
		}
		// var json_d_d= JSON.parse(json_d);

		console.log("json_d="+json_d);
		// newPl = new PlantationArea({ name:plantation_name,group_id:nursary_id,address:address,
		// 	caretaker:caretaker,
		// 			plant:nm,quantity:qty,add_date:dt,phone:phone,
		// 			plant_list: [{ plant: bb[0], qty: bb[1],added_date:bb[2] }]});

		await	PlantationArea.findOneAndUpdate({plantation_name: plantation_id }, 
				{plant_list: [JSON.parse(json_d)]}, null, function (err, docs) {
				if (err){
					console.log(err)
				}
				else{
					console.log("Original Doc : ",docs);
				}
			});

		
		// const row_count = req.body.row_count;	
		// var newPlantation_area =0;

		// const tbl_ln=row_count;
			// 	 newPlantation_area = new PlantationArea({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
			// 	plant:plant_name,quantity:qty,add_date:added_date,phone:phone});		
			// await newPlantation_area.save();

		// var nm,qty,dt,idnm,idqty,iddt;

		// var newNursary =0;
		// for(i=1;i<=tbl_ln;i++){
		// 	idnm='nm_'+i;
		// 	idqty='qty_'+i;
		// 	iddt='dt_'+i;


		// 	// nm=req.body."nm_"+i;
		// 	qty=req.body.idqty;
		// 	dt=req.body.iddt;

		// 	console.log("dfsdf===="+iddt);
		// 	console.log("document===="+document.getElementById('nm_1').value);


		// 	 newNursary = new Nursary({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
		// 		plant:nm,quantity:qty,add_date:dt,phone:phone});		
		// 	await newNursary.save();



		// }

	

	

	



	//	res.json(newPlant)
		req.flash("success", "Data saved successfully");
		// res.redirect("/admin/add_plant_to_plantation");
		res.redirect(`/admin/single_plantation_details/view/${plantation_id}`);

		
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});




router.post("/admin/add_plant_to_plantation",  async (req,res) => {
	
	try
	{		
	
		const plantation_name = req.body.plantation_name;	
		const plantation_id = req.body.plantation_id;	
		const caretaker = req.body.caretaker;	
		const address = req.body.address;	
		const phone = req.body.phone;	

		var newPl=0;

		const pl_de = req.body.pl_de;	

		console.log("pl_de="+pl_de);
		const myArray = pl_de.split("<====>");
		const arrLen=myArray.length;


		var aa=0;
		var bb=0;
		var json_d="";
		var arrLen_bb=0;



		for(var j=0;j<arrLen-1;j++)
		{
			aa=myArray[j].toString();
			bb=aa.split("<==>");
			

		
	

		console.log("json_d="+json_d);
		newPl = new PlantationPlants({  plant: bb[0], qty: bb[1],added_date:bb[2],
			plantation_id:plantation_id });
						await newPl.save();

					}

		
		// const row_count = req.body.row_count;	
		// var newPlantation_area =0;

		// const tbl_ln=row_count;
			// 	 newPlantation_area = new PlantationArea({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
			// 	plant:plant_name,quantity:qty,add_date:added_date,phone:phone});		
			// await newPlantation_area.save();

		// var nm,qty,dt,idnm,idqty,iddt;

		// var newNursary =0;
		// for(i=1;i<=tbl_ln;i++){
		// 	idnm='nm_'+i;
		// 	idqty='qty_'+i;
		// 	iddt='dt_'+i;


		// 	// nm=req.body."nm_"+i;
		// 	qty=req.body.idqty;
		// 	dt=req.body.iddt;

		// 	console.log("dfsdf===="+iddt);
		// 	console.log("document===="+document.getElementById('nm_1').value);


		// 	 newNursary = new Nursary({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
		// 		plant:nm,quantity:qty,add_date:dt,phone:phone});		
		// 	await newNursary.save();



		// }

	

	

	



	//	res.json(newPlant)
		req.flash("success", "Data saved successfully");
		// res.redirect("/admin/add_plant_to_plantation");
		res.redirect(`/admin/single_plantation_details/view/${plantation_id}`);

		
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});


router.post("/admin/add_plant_to_nursary",  async (req,res) => {
	
	try
	{		
	
		const nursary_name = req.body.nursary_name;	
		const nursary_id = req.body.nursary_id;	
		const caretaker = req.body.caretaker;	
		const address = req.body.address;	
		const phone = req.body.phone;	

		const plant_name = req.body.plant_name;	
		const qty = req.body.qty;	
		const added_date = req.body.added_date;	


		const row_count = req.body.row_count;	
		var newNursary =0;

		const tbl_ln=row_count;
				 newNursary = new Nursary({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
				plant:plant_name,quantity:qty,add_date:added_date,phone:phone});		
			await newNursary.save();

		// var nm,qty,dt,idnm,idqty,iddt;

		// var newNursary =0;
		// for(i=1;i<=tbl_ln;i++){
		// 	idnm='nm_'+i;
		// 	idqty='qty_'+i;
		// 	iddt='dt_'+i;


		// 	// nm=req.body."nm_"+i;
		// 	qty=req.body.idqty;
		// 	dt=req.body.iddt;

		// 	console.log("dfsdf===="+iddt);
		// 	console.log("document===="+document.getElementById('nm_1').value);


		// 	 newNursary = new Nursary({ name:nursary_name,group_id:nursary_id,address:address,caretaker:caretaker,
		// 		plant:nm,quantity:qty,add_date:dt,phone:phone});		
		// 	await newNursary.save();



		// }

	

	

	



	//	res.json(newPlant)
		req.flash("success", "Data saved successfully");
		res.redirect("/admin/nursary_details/view/:nursaryId");
	}
	catch(err)
	{
		console.log(err);
		// req.flash("error", "Some error occurred on the server.")
		req.flash("success", "Data saved successfully");
		res.redirect("back");
	}
});




		
	




router.post("/admin/add_plant_to_nursary", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const nursaryId = req.params.nursaryId;
		
	
		const newplant=Nursasy({name:  name,address:address,group_id:_id,phone:phone,caretaker:caretaker,
			plant_name:plant_name,	
			quantity:qty,date:date});

			await newplant.save();
			
		req.flash("success", "Plants assigned successfully");
		res.redirect(`/admin/donation/view/${donationId}`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});


router.get("/admin/add_new_plantationArea", middleware.ensureAdminLoggedIn,  (req,res) => {
	

	res.render("admin/add_new_plantationArea", {
		title: "Add Plantation Area"
	});
});

router.post("/admin/save_new_plantationArea", middleware.ensureAdminLoggedIn, async (req,res) => {

	const { name, address, caretaker, phone} = req.body;
	let errors = [];
	


	
	try
	{
	
		
		const newPlant = new PlantationArea({ name, address, caretaker, phone});

		console.log(newPlant)
 			await newPlant.save();
		req.flash("success", "new Plantation Area saved successfully .");
		res.redirect(`/admin/add_new_plantationArea`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}


	
});


router.post("/admin/save_new_nursary", middleware.ensureAdminLoggedIn, async (req,res) => {

	const { name, address, caretaker, phone} = req.body;
	let errors = [];
	


	
	try
	{
	
		
		const newnurdsry = new Nursary({ name, address, caretaker, phone});

		console.log(newnurdsry)
 			await newnurdsry.save();
		req.flash("success", "new nursary saved successfully .");
		res.redirect(`/admin/show_nursary_details`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}


	
});


router.post("/admin/save_notification", middleware.ensureAdminLoggedIn, async (req,res) => {

	const { message, added_date} = req.body;


	
    // let transporter = nodemailer.createTransport({
	// 	service: 'gmail',
	// 	auth: {
	// 	  user: process.env.MY_SECRET_EMAILID, // generated ethereal user
	// 	  pass: process.env.MY_SECRET_PASSWORD, // generated ethereal password
	// 	},
	//   });
	  
   
	// 	  let mailOptions = {
	// 		  from: from,
	// 		  to:to,
	// 		  subject:subject,
	// 		  text:message
		  
	  
  
	//   };
	  
	//   transporter.sendMail(mailOptions, function (err, info) {
	// 	if (err) {
	// 	  res.json(err);
	// 	} else {
	// 	  console.log("Email Sent: " + info.response)
	// 	  res.json(info);
	// 	}
	//   });

	


	
	try
	{
	
		
		const newNotification = new Notification({ message, added_date});

		//console.log(newNotification)
 			await newNotification.save();



			//////////////////
			////////////////////////
		req.flash("success", "new notification saved successfully .");
		res.redirect(`/admin/add_notification`);
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}


	
});

router.get("/admin/volunteer", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const volunteer = await User.find({ role: "donor" });
		res.render("admin/volunteers", { title: "List of volunteer", volunteer });
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});
router.get("/admin/single_plantation_details/view/:plantationId", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const plantationId = req.params.plantationId;
		const plants=await Plant.find();

		console.log("plantationId="+plantationId);
		// const nursary_details = await Nursary.findById(nursaryId).populate("plant").populate("quantity").populate("caretaker");
		const plantationArea = await PlantationArea.find({_id: plantationId });

		const plantationPlants = await PlantationPlants.find({plantation_id: plantationId });

		

		//console.log("nursary_d="+nursary_d)

	//const numCount = await Nursary.countDocuments({ group_id: nursaryId });

//console.log("nursary_details="+nursary_details+"=======numCount="+numCount);
		res.render("admin/single_plantation_details", { title: "Plants details", plantationArea,plants,plantationId,plantationPlants});
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});




router.get("/admin/profile", middleware.ensureAdminLoggedIn, (req,res) => {
	res.render("admin/profile", { title: "My profile" });
});

router.put("/admin/profile", middleware.ensureAdminLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.admin;	// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/admin/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;