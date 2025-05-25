const mongoose = require("mongoose");

// Define a schema for project assignment collection
const assignmentSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  project_code: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  start_date: Date,
});

// Export ProjectAssignment model using the assignmentSchema
module.exports = mongoose.model("ProjectAssignment", assignmentSchema);
