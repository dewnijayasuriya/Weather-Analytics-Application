import { Router } from "express";
import { getCacheStatus } from "../cache/weather.cache";

const router = Router();

router.get("/", (req, res) => {
  const cacheStatus = getCacheStatus();

  res.json({
    cacheDuration: "5 minutes",
    cities: cacheStatus,
  });
});

export default router;