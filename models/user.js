const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	gender: {
		type: String,
		enum: ["male", "female"]
	},
	address: String,
	phone: Number,
	joinedTime: {
		type: Date,
		default: Date.now
	},
	role: {
		type: String,
		enum: ["admin", "donor", "agent", "ngo", "volunteer"],
		required: true
	},
	token: {
		type: String,
		default: ''
	},
	// Admin email confirmation — false until they click the confirmation link in their email
	isVerified: {
		type: Boolean,
		default: true   // true for all roles; set to false only when admin registers
	}
}, {
	timestamps: true,
});

const User = mongoose.model("users", userSchema);
module.exports = User;