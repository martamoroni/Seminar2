const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const apiRoutes = require("./src/routes/index");
const cors = require("cors"); // to make API calls from frontend
const connectDB = require("./src/config/db");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Only allow this origin
  })
);

// Mount API routes
app.use("/api", apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
