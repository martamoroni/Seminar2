const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
  project_code: { type: mongoose.Schema.Types.ObjectId, ref: "Project" },
  start_date: Date,
});

module.exports = mongoose.model("ProjectAssignment", assignmentSchema);
