import express from "express";
import CustomError from "../utils/CustomError.js";
import ResponseHandler from "../utils/CustomResponse.js";
import os from "os";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();


router.get("/success", (req, res) => {
  ResponseHandler.success(res, 200, "Data retrieved successfully", { user: "John Doe" });
});

router.get("/bad-request", (req, res, next) => {
  next(new CustomError("Invalid request data", 400, { field: "email", message: "Email is required" }));
});

router.get("/not-found", (req, res, next) => {
  next(new CustomError("User not found", 404));
});

router.get("/server-error", (req, res, next) => {
  next(new CustomError()); // Defaults to 500
});




router.get("/health", async (req, res) => {
  const healthCheck = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memoryUsage: process.memoryUsage(),
    cpuLoad: os.loadavg(),
    database: "pending",
  };

  try {
    // Save a new health check entry in the database
    const newHealthCheck = await prisma.healthCheck.create({
      data: {},
    });

    // Retrieve the latest health check record
    const lastHealthCheck = await prisma.healthCheck.findFirst({
      orderBy: { createdAt: "desc" },
    });

    healthCheck.database = "connected";
    healthCheck.lastHealthCheck = lastHealthCheck?.createdAt || "No records found";
  } catch (error) {
    healthCheck.database = "error";
    return ResponseHandler.error(res, 503, "Service Unavailable", healthCheck);
  }

  return ResponseHandler.success(res, 200, "Health check successful", healthCheck);
});

export default router;
