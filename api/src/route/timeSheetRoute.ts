import express from "express";
import { createEmployeeTimeSheet } from "../controllers/timeSheetController.js";

const router = express.Router();

router.post("/", createEmployeeTimeSheet);

export default router;
