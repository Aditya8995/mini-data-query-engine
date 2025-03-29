const express = require("express");
const dotenv = require("dotenv");
const queryRoutes = require("./src/routes/queryRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api", queryRoutes);

app.get("/", (req, res) => {
  res.send("Mini Data Query Simulation Engine API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
