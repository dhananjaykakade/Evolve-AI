import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.js";



describe("🚀 Production-Grade Application Tests", () => {

  it("🛑 Should return a 400 error for bad request", async () => {
    const res = await request(app).get("/api/test/bad-request");

    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({
      success: false,
      statusCode: 400,
      message: "Invalid request data",
      errors: expect.objectContaining({
        field: "email",
        message: "Email is required",
      }),
    });

    // Ensure error contains expected field
    expect(res.body.errors).toHaveProperty("field", "email");
  });

  it("🚨 Should return a 404 error for not found", async () => {
    const res = await request(app).get("/api/test/not-found");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      statusCode : 404,
      message: "User not found",
      errors: {}
    });
  });

  it("🔥 Should return a 500 error for server failure", async () => {
    const res = await request(app).get("/api/test/server-error");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      statusCode: 500,
      message: "Internal Server Error",
    });
  });
});
