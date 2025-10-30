import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import employeeRoutes from "./route/employeeRoute.js";
import timeSheetRoute from "./route/timeSheetRoute.js";
import payRunRoute from "./route/payRunRoute.js";
import metricsRoute from "./route/metricsRoute.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/timesheet", timeSheetRoute);
app.use("/api/payruns", payRunRoute);
app.use("/api/metrics", metricsRoute);

app.get("/", (_req, res) => res.json({ message: "Server is running!" }));

export default app;
