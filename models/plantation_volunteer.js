const mongoose = require("mongoose");

const plantationVolunteerSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},

    plantation_id: {
		type: String,
		
		
	}
  ,
  plantation_name: {
		type: String,
		
		
	},

  volunteerId: {
		type: String,
		
		
	},

    added_date: {
		type: Date,
		required: true
		
	},
    created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      }	});

const PlantationVolunteer = mongoose.model("plantation_volunteer", plantationVolunteerSchema);
module.exports = PlantationVolunteer;