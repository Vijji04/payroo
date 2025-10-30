import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import employeeRoutes from "./route/employeeRoute.js";
import timeSheetRoute from "./route/timeSheetRoute.js";
import payRunRoute from "./route/payRunRoute.js";
import metricsRoute from "./route/metricsRoute.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "https://payroo-nv6sq9df8-vijji04s-projects.vercel.app/",
  "https://payroo-omega.vercel.app/",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

app.use(express.json());

app.use("/api/employees", employeeRoutes);
app.use("/api/timesheet", timeSheetRoute);
app.use("/api/payruns", payRunRoute);
app.use("/api/metrics", metricsRoute);

app.get("/", (_req, res) => res.json({ message: "Server is running!" }));

export default app;
