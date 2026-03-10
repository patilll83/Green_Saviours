const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	description: {
		type: String,
		
	} ,
	time : { type : Date, default: Date.now }
	
	
});



const Plant = mongoose.model("plants", plantSchema);
module.exports = Plant;