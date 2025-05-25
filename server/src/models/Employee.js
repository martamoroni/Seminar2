const mongoose = require("mongoose");

// Define a schema for employee collection
const employeeSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  full_name: String,
  email: String,
  hashed_password: String,
});

// Export Employee model using the employeeSchema
module.exports = mongoose.model("Employee", employeeSchema);
