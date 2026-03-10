const mongoose = require("mongoose");

const plantationAreaSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
		
	},

    caretaker: {
		type: String,
		required: true
		
	},

    phone: {
		type: Number,
		required: true
		
	},

	
	

	
	},

{
	timestamp: true,
});

const Plantation_area = mongoose.model("plantation_areas", plantationAreaSchema);
module.exports = Plantation_area;