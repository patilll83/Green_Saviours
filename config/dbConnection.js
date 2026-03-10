const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Set strictQuery option to true or false depending on your preference
    mongoose.set('strictQuery', true); // or false if you prefer the upcoming behavior

    // Use the environment variable for the MongoDB URI or fall back to a local MongoDB instance
    const db = process.env.MONGO_URI || 'mongodb://localhost:27017';

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
