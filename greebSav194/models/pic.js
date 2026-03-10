const mongoose = require("mongoose");

const picSchema = new mongoose.Schema({
	name: {
		type: String,
		
	},
	volunteerId: {
		type: String,
		
	},
	firstName: {
		type: String,
		
	},
	img: {
        type: String,
		
	} ,	
	img_path: {
        type: String,
		
	} ,
	time : { type : Date, default: Date.now }
   
	
});



const Pic = mongoose.model("pics", picSchema);
module.exports = Pic;