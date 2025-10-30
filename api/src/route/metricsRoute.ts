import express from "express";
import {
  getMetrics,
  getLogs,
  getHealth,
} from "../controllers/metricsController.js";

const router = express.Router();

router.get("/", getMetrics);
router.get("/logs", getLogs);
router.get("/health", getHealth);

export default router;
