import { env } from "./config/env";
import express from "express";
import cors from "cors";

import weatherRoutes from "./routes/weather.routes";
import cacheRoutes from "./routes/cache.routes";

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

app.listen(env.port, () => {
  console.log(`Server running on port ${env.port}`);
});
