import request from "supertest";
import app from "../../src/app.js";


jest.mock("../../src/utils/logger.js", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
}));


/*{
    "success": true,
    "statusCode": 200,
    "message": "Health check successful",
    "data": {
        "status": "ok",
        "uptime": 84.057885,
        "timestamp": "2025-02-25T12:19:31.494Z",
        "memoryUsage": {
            "rss": 63188992,
            "heapTotal": 15065088,
            "heapUsed": 13207224,
            "external": 3667639,
            "arrayBuffers": 65854
        },
        "cpuLoad": [
            0,
            0,
            0
        ],
        "database": "connected",
        "lastHealthCheck": "2025-02-25T12:19:31.977Z"
    }
}
    follow this response for test
     */



describe("HealthCheck API", () => {
  test("should return 200 with health status", async () => {
    const response = await request(app).get("/api/test/health");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/); // Ensure JSON response
    expect(response.body).toEqual({
      success: true,
      message: "Health check successful",
      statusCode: 200,
      data: {
        status: "ok", // Status should be "ok"
        uptime: expect.any(Number), // Uptime should be a number
        database: expect.any(String), // Database connection should be true/false
        timestamp: expect.any(String),// Should be a string (ISO timestamp)
        memoryUsage: expect.any(Object), // Memory usage should be an object
        cpuLoad: expect.any(Array), // CPU load should be an array
        lastHealthCheck: expect.any(String), // Last health check timestamp should be a string (ISO timestamp)
      }
    });

    // Additional checks
    expect(response.body.data.uptime).toBeGreaterThan(0); // Uptime should be positive
    expect(new Date(response.body.data.timestamp).toString()).not.toBe("Invalid Date"); // Ensure valid timestamp
  });
});
