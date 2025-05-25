const mongoose = require("mongoose");

// Define a schema for project collection
const projectSchema = new mongoose.Schema({
  project_code: { type: String, required: true, unique: true },
  project_name: String,
  project_description: String,
});

// Export Project model using the projectSchema
module.exports = mongoose.model("Project", projectSchema);
