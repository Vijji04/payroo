import express from "express";
import {
  addEmployee,
  getEmployees,
} from "../controllers/employeesController.js";

const router = express.Router();

router.post("/", addEmployee);
router.get("/", getEmployees);

export default router;
