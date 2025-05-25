const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Point to the correct path when running from root
dotenv.config({ path: __dirname + "/../../.env" });

// Async function to connect to MongoDB using Mongoose
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL);
    console.log("MongoDB connected");
  } catch (err) {
    // If connection is not successful, show error message
    console.error(err.message);
    // Exit the process with failure code
    process.exit(1);
  }
};

module.exports = connectDB;
