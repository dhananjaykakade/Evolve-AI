import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app.js";

const prisma = new PrismaClient();

describe("🚀 Production-Grade Application Tests", () => {
  beforeAll(async () => {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully before tests");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      throw error; // Fails the test suite if DB connection fails
    }
  });   

  afterAll(async () => {
    try {
      await prisma.$disconnect();
      console.log("🛑 Database disconnected after tests");
    } catch (error) {
      console.error("❌ Database disconnection failed:", error);
    }
  });

  it("✅ Should start the server and return a 200 response", async () => {
    const res = await request(app).get("/api/test/health");

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual({
      success: true,
      message: "Health check successful",
      data: {
        status: "ok",
        database: "connected",
      },
    });

    // Ensure valid database status
    expect(res.body.data.status).toBe("ok");
    expect(res.body.data.database).toBe("connected");
  });

  it("🛑 Should return a 400 error for bad request", async () => {
    const res = await request(app).get("/api/test/bad-request");

    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toMatchObject({
      success: false,
      message: "Invalid request data",
      errors: expect.objectContaining({
        field: "email",
      }),
    });

    // Ensure error contains expected field
    expect(res.body.errors).toHaveProperty("field", "email");
  });

  it("🚨 Should return a 404 error for not found", async () => {
    const res = await request(app).get("/api/test/not-found");

    expect(res.status).toBe(404);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual({
      success: false,
      message: "User not found",
    });
  });

  it("🔥 Should return a 500 error for server failure", async () => {
    const res = await request(app).get("/api/test/server-error");

    expect(res.status).toBe(500);
    expect(res.headers["content-type"]).toMatch(/json/);
    expect(res.body).toEqual({
      success: false,
      message: "Internal Server Error",
    });
  });
});
