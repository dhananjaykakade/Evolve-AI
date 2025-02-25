import request from "supertest";
import express from "express";
import ResponseHandler from "../../../src/utils/CustomResponse.js"; // Adjust path as needed

const app = express();
app.use(express.json());

// Sample routes for testing
app.get("/success", (req, res) => {
  ResponseHandler.success(res, 200, "Success Message", { key: "value" });
});

app.get("/error", (req, res) => {
  ResponseHandler.error(res, 500, "Internal Server Error", { error: "DB Failure" });
});

app.get("/validation-error", (req, res) => {
  ResponseHandler.validationError(res, "Validation Failed", { field: "Invalid data" });
});

app.get("/unauthorized", (req, res) => {
  ResponseHandler.unauthorized(res);
});

app.get("/forbidden", (req, res) => {
  ResponseHandler.forbidden(res);
});

app.get("/not-found", (req, res) => {
  ResponseHandler.notFound(res);
});

app.get("/bad-request", (req, res) => {
  ResponseHandler.badRequest(res, "Bad Request", { reason: "Invalid input" });
});

app.get("/conflict", (req, res) => {
  ResponseHandler.conflict(res);
});

app.get("/too-many-requests", (req, res) => {
  ResponseHandler.tooManyRequests(res);
});

app.get("/service-unavailable", (req, res) => {
  ResponseHandler.serviceUnavailable(res);
});

describe("ResponseHandler Class", () => {
  test("Success Response", async () => {
    const res = await request(app).get("/success");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      success: true,
      statusCode: 200,
      message: "Success Message",
      data: { key: "value" },
    });
  });

  test("Error Response", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
      errors: { error: "DB Failure" },
    });
  });

  test("Validation Error Response", async () => {
    const res = await request(app).get("/validation-error");
    expect(res.status).toBe(422);
    expect(res.body).toEqual({
      success: false,
      statusCode: 422,
      message: "Validation Failed",
      errors: { field: "Invalid data" },
    });
  });

  test("Unauthorized Response", async () => {
    const res = await request(app).get("/unauthorized");
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("success", false);
    expect(res.body).toHaveProperty("statusCode", 401);
  });

  test("Forbidden Response", async () => {
    const res = await request(app).get("/forbidden");
    expect(res.status).toBe(403);
  });

  test("Not Found Response", async () => {
    const res = await request(app).get("/not-found");
    expect(res.status).toBe(404);
  });

  test("Bad Request Response", async () => {
    const res = await request(app).get("/bad-request");
    expect(res.status).toBe(400);
    expect(res.body.errors).toHaveProperty("reason", "Invalid input");
  });

  test("Conflict Response", async () => {
    const res = await request(app).get("/conflict");
    expect(res.status).toBe(409);
  });

  test("Too Many Requests Response", async () => {
    const res = await request(app).get("/too-many-requests");
    expect(res.status).toBe(429);
  });

  test("Service Unavailable Response", async () => {
    const res = await request(app).get("/service-unavailable");
    expect(res.status).toBe(503);
  });
});
