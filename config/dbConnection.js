const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Set strictQuery option to true or false depending on your preference
    mongoose.set('strictQuery', true); // or false if you prefer the upcoming behavior

    // Support both MONGO_URI (Atlas) and MONGO_URL (local) env variable names
    const db = process.env.MONGO_URI || process.env.MONGO_URL || 'mongodb://localhost:27017/db_green';

    // Connect to MongoDB using the provided connection string
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected...");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = connectDB;
