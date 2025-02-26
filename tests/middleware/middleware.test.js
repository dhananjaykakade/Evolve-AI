import errorMiddleware from "../../src/middleware/errorMiddleware.js";
import ResponseHandler from "../../src/utils/CustomResponse.js";
import { logger } from "../../src/utils/logger.js";
import express from "express";
import request from "supertest";

// Mock the ResponseHandler and Logger
jest.mock("../../src/utils/CustomResponse.js", () => ({
  handleError: jest.fn((err, res) => {
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
      errors: err.errors || {},
    });
  }),
}));
  

jest.mock("../../src/utils/logger.js", () => ({
  logger: {
    log: jest.fn(),
  },
}));

const app = express();
app.use(express.json());


// Dummy route to trigger an error
app.get("/test-error", (req, res, next) => {
  const error = new Error("Test error message");
  error.statusCode = 500;
  next(error);
});

// Attach error middleware
app.use(errorMiddleware);

describe("Error Middleware Tests", () => {
  it("should handle errors and return correct response", async () => {
    const response = await request(app).get("/test-error");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      message: "Test error message",
      errors: {},
    });

    // Ensure logger is called with the correct error log
    expect(logger.log).toHaveBeenCalledWith({
      level: "error",
      message: "500 - Test error message (GET /test-error)",
      meta: {
        statusCode: 500,
        route: "/test-error",
        method: "GET",
        errors: {},
      },
      stack: expect.any(String), // Stack trace should be logged
    });

    // Ensure ResponseHandler is called properly
    expect(ResponseHandler.handleError).toHaveBeenCalled();
  },10000);
});