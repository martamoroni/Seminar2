const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const apiRoutes = require("./src/routes/index");
const cors = require("cors");
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// To make API calls from frontend
app.use(
  cors({
    origin: "http://localhost:5173", // Only allow this origin
  })
);

// Mount API routes
app.use("/api", apiRoutes);

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, "../client/dist")));

// Handle all other routes by serving the index.html
app.get("*name", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
