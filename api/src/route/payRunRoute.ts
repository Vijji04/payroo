import express from "express";
import { createPayRun } from "../controllers/payrunController.js";

const router = express.Router();

router.post("/", createPayRun);

export default router;
