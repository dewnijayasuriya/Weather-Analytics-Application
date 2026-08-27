import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import weatherRoutes from "./routes/weather.routes";
import cacheRoutes from "./routes/cache.routes";

dotenv.config();

const app = express();


// Middleware
app.use(cors());
app.use(express.json());


// Health check
app.get("/", (req, res) => {
  res.json({
    message: "Weather Analytics API is running",
  });
});


// API routes
app.use("/api/weather", weatherRoutes);
app.use("/api/cache", cacheRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});