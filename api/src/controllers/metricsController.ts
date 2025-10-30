import { Request, Response } from "express";

interface LogEntry {
  level: "info" | "error" | "warn";
  msg: string;
  reqId?: string;
  timestamp: string;
}

interface ApiMetrics {
  totalRequests: number;
  totalErrors: number;
  uptime: number;
  startTime: Date;
  endpoints: Record<string, { count: number; errors: number }>;
}

// Store logs in memory (last 100 logs)
const logs: LogEntry[] = [];
const MAX_LOGS = 100;

const metrics: ApiMetrics = {
  totalRequests: 0,
  totalErrors: 0,
  uptime: 0,
  startTime: new Date(),
  endpoints: {},
};

// Logger utility
export const logger = {
  info: (msg: string, reqId?: string) => {
    const entry: LogEntry = {
      level: "info",
      msg,
      reqId,
      timestamp: new Date().toISOString(),
    };
    addLog(entry);
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  },
  error: (msg: string, reqId?: string) => {
    const entry: LogEntry = {
      level: "error",
      msg,
      reqId,
      timestamp: new Date().toISOString(),
    };
    addLog(entry);
    console.error(JSON.stringify(entry));
  },
  warn: (msg: string, reqId?: string) => {
    const entry: LogEntry = {
      level: "warn",
      msg,
      reqId,
      timestamp: new Date().toISOString(),
    };
    addLog(entry);
    console.warn(JSON.stringify(entry));
  },
};

function addLog(entry: LogEntry) {
  logs.push(entry);
  if (logs.length > MAX_LOGS) {
    logs.shift();
  }
}

export const trackRequest = (endpoint: string, isError = false) => {
  metrics.totalRequests++;
  if (isError) {
    metrics.totalErrors++;
  }

  if (!metrics.endpoints[endpoint]) {
    metrics.endpoints[endpoint] = { count: 0, errors: 0 };
  }

  metrics.endpoints[endpoint].count++;
  if (isError) {
    metrics.endpoints[endpoint].errors++;
  }
};

// Get metrics endpoint
export const getMetrics = async (req: Request, res: Response) => {
  try {
    const uptimeSeconds = Math.floor(
      (Date.now() - metrics.startTime.getTime()) / 1000
    );
    metrics.uptime = uptimeSeconds;

    res.json({
      status: "healthy",
      uptime: `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor(
        (uptimeSeconds % 3600) / 60
      )}m ${uptimeSeconds % 60}s`,
      uptimeSeconds,
      startTime: metrics.startTime,
      metrics: {
        totalRequests: metrics.totalRequests,
        totalErrors: metrics.totalErrors,
        errorRate:
          metrics.totalRequests > 0
            ? ((metrics.totalErrors / metrics.totalRequests) * 100).toFixed(2) +
              "%"
            : "0%",
        endpoints: metrics.endpoints,
      },
    });
  } catch (error) {
    logger.error("Error fetching metrics");
    res.status(500).json({ message: "Error fetching metrics", error });
  }
};

// Get logs endpoint
export const getLogs = async (req: Request, res: Response) => {
  try {
    const { level, limit = "50" } = req.query;

    let filteredLogs = [...logs];

    // Filter by level if specified
    if (level && typeof level === "string") {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    // Limit results
    const limitNum = parseInt(limit as string, 10);
    const limitedLogs = filteredLogs.slice(-limitNum);

    res.json({
      total: logs.length,
      returned: limitedLogs.length,
      logs: limitedLogs.reverse(),
    });
  } catch (error) {
    logger.error("Error fetching logs");
    res.status(500).json({ message: "Error fetching logs", error });
  }
};

export const getHealth = async (req: Request, res: Response) => {
  try {
    const uptimeSeconds = Math.floor(
      (Date.now() - metrics.startTime.getTime()) / 1000
    );

    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: uptimeSeconds,
      service: "payroo-api",
    });
  } catch (error) {
    res.status(500).json({ status: "unhealthy", error });
  }
};
