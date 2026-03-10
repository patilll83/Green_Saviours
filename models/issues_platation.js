const mongoose = require("mongoose");

const issuesSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	added_date: {
		type: Date,default: Date.now		
	},
	caretaker_id: {
		type: String		
	},
    caretaker_nm: {
		type: String		
	}	
	},{
	timestamp: true,
});

const Issues_plantation = mongoose.model("plant_issues", issuesSchema);
module.exports = Issues_plantation;