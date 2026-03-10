const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	message: {
		type: String,
		required: true
	},
	added_date: {
		type: Date,default: Date.now
		
	}
	

	
	},

{
	timestamp: true,
});

const Notification = mongoose.model("notifications", notificationSchema);
module.exports = Notification;