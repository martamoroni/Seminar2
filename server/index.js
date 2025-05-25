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

// Middleware to serve static files
// TODO: Run "npm run build" on client folder to create the static version of the app in the dist folder

// app.use(express.static(path.join(__dirname, "../client/dist")));

// This is useful if no routes match -> it sends back to index.html
// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(__dirname, "../client/dist/index.html"));
// });

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
