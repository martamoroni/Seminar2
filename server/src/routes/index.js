const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const Employee = require("../models/Employee");
const Project = require("../models/Project");
const ProjectAssignment = require("../models/ProjectAssignment");

// POST new employee
router.post("/employees", async (req, res) => {
  const { employee_id, full_name, email, password } = req.body;

  if (!employee_id || !full_name || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await Employee.findOne({ employee_id });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Employee ID already exists, choose a new one." });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newEmployee = new Employee({
      employee_id,
      full_name,
      email,
      hashed_password: hashedPassword,
    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee created successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error." });
  }
});

// POST a new project
router.post("/projects", async (req, res) => {
  const { project_code, project_name, project_description } = req.body;

  if (!project_code || !project_name) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const existing = await Project.findOne({ project_code });
    if (existing) {
      return res
        .status(409)
        .json({ error: "Project code already exists, choose a new one." });
    }

    const project = new Project({
      project_code,
      project_name,
      project_description,
    });

    await project.save();
    res.status(201).json({ message: "Project created successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// POST a new project_assignments, with employeeID and projectCode
router.post("/project_assignments", async (req, res) => {
  const { employee_id, project_code, start_date } = req.body;

  if (!employee_id || !project_code || !start_date) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const employee = await Employee.findOne({ employee_id });
    const project = await Project.findOne({ project_code });

    if (!employee || !project) {
      return res
        .status(404)
        .json({ error: "Invalid employee_id or project_code." });
    }

    const assignment = new ProjectAssignment({
      employee_id: employee._id,
      project_code: project._id,
      start_date,
    });

    await assignment.save();
    res.status(201).json({ message: "Assignment created successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error." });
  }
});

// GET all project_assignments
router.get("/project_assignments", async (req, res) => {
  try {
    // .populate() to get the document the id refers to
    const assignments = await ProjectAssignment.find()
      .populate({
        path: "employee_id",
        select: "employee_id full_name",
      })
      .populate({
        path: "project_code",
        select: "project_code project_name",
      });

    // To make it easier for the frontend
    const cleanAssigments = assignments.map((assign) => ({
      employee_id: assign.employee_id.employee_id,
      employee_name: assign.employee_id.full_name,
      project_code: assign.project_code.project_code,
      project_name: assign.project_code.project_name,
      start_date: assign.start_date,
    }));

    res.json(cleanAssigments);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
