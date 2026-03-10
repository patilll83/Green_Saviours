const mongoose = require("mongoose");

const plantationPlantsSchema = new mongoose.Schema({
	plant: {
		type: String,
		required: true
	},
	qty: {
		type: Number,
		required: true
		
	},

    plantation_id: {
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
      }	
	}

);

const PlantationPlants = mongoose.model("plantation_plants", plantationPlantsSchema);
module.exports = PlantationPlants;