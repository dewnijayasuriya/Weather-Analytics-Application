import { Router } from "express";
import { getCacheStatus, clearCache } from "../cache/weather.cache";

const router = Router();

// Debug endpoint: shows raw + processed cache status and HIT / MISS counters.
router.get("/", (req, res) => {
  res.json(getCacheStatus());
});

// Convenience for testing: wipe the cache so the next request is a guaranteed MISS.
router.post("/clear", (req, res) => {
  clearCache();
  res.json({ message: "Cache cleared" });
});

export default router;
