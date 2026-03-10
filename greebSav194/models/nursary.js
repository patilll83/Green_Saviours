const mongoose = require("mongoose");

const nursarySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	group_id: {
		type: String,
		
	},
	address: {
		type: String,
		required: true
	},
	caretaker: {
		type: String,
		required: true
	},
	plant: {
		type: String,
	
	},
	quantity: {
		type: Number,
		
	},
	add_date: {
		type: Date,
	
	},
	phone: {
		type: Number,
		required: true
	}


	
	},

{
	timestamp: true,
});

const Donation = mongoose.model("nursarys", nursarySchema);
module.exports = Donation;