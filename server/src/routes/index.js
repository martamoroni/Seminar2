const express = require("express");
const bcrypt = require("bcrypt");

// Models
const Employee = require("../models/Employee");
const Project = require("../models/Project");
const ProjectAssignment = require("../models/ProjectAssignment");

const router = express.Router();

// POST new employee
router.post("/employees", async (req, res) => {
  // Extract employee data from request body
  const { employee_id, full_name, email, password } = req.body;

  // Check if all fields are provided
  if (!employee_id || !full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if employee already exists based on employee_id
    const existing = await Employee.findOne({ employee_id });
    // If it does, send status code 409: "Conflict"
    if (existing) {
      return res
        .status(409)
        .json({ error: "Employee ID already exists, choose a new one." });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new employee
    const newEmployee = new Employee({
      employee_id,
      full_name,
      email,
      hashed_password: hashedPassword,
    });

    // Save new employee in the database
    await newEmployee.save();

    // Respond with 201 status: "Created"
    res.status(201).json({ message: "Employee created successfully." });
  } catch (err) {
    // Show error
    console.error(err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error." });
  }
});

// POST a new project
router.post("/projects", async (req, res) => {
  // Extract project data from request body
  const { project_code, project_name, project_description } = req.body;

  // Check if all fields are provided
  if (!project_code || !project_name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if project already exists based on project_code
    const existing = await Project.findOne({ project_code });
    // If it does, send status code 409: "Conflict"
    if (existing) {
      return res
        .status(409)
        .json({ error: "Project code already exists, choose a new one." });
    }

    // Create new project
    const project = new Project({
      project_code,
      project_name,
      project_description,
    });

    // Save new project in the database
    await project.save();

    // Respond with 201 status: "Created"
    res.status(201).json({ message: "Project created successfully." });
  } catch (err) {
    // Show error
    console.error(err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error." });
  }
});

// POST a new project_assignments, with employeeID and projectCode
router.post("/project_assignments", async (req, res) => {
  // Extract project_assignments data from request body
  const { employee_id, project_code, start_date } = req.body;

  // Check if all fields are provided
  if (!employee_id || !project_code || !start_date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if employee and project exist
    const employee = await Employee.findOne({ employee_id });
    const project = await Project.findOne({ project_code });

    // If they don't exist, send status code 404: "Not Found"
    if (!employee || !project) {
      return res
        .status(404)
        .json({ error: "Invalid employee_id or project_code." });
    }

    // Create new project
    const assignment = new ProjectAssignment({
      employee_id: employee._id,
      project_code: project._id,
      start_date,
    });

    // Save new project assigment in the database
    await assignment.save();

    // Respond with 201 status: "Created"
    res.status(201).json({ message: "Assignment created successfully." });
  } catch (err) {
    // Show error
    console.error(err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error." });
  }
});

// GET all project_assignments
router.get("/project_assignments", async (req, res) => {
  try {
    // Finds all project assignments in the database
    // .populate() to get the document the id refers to
    const assignments = await ProjectAssignment.find()
      .populate({
        path: "employee_id",
        select: "employee_id full_name",
      })
      .populate({
        path: "project_code",
        select: "project_code project_name",
      })
      .sort({ start_date: -1 }); // To get them in order from newest

    // To make it easier for the frontend
    const cleanAssigments = assignments.map((assign) => ({
      employee_id: assign.employee_id.employee_id,
      employee_name: assign.employee_id.full_name,
      project_code: assign.project_code.project_code,
      project_name: assign.project_code.project_name,
      start_date: assign.start_date,
    }));

    // Response with the assigments found
    res.json(cleanAssigments);
  } catch (err) {
    // Show error
    console.error(err.message);
    // 500: Internal Server Error
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
