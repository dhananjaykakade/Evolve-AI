import dotenv from 'dotenv'

dotenv.config(); // Load environment variables


jest.mock("../src/utils/logger.js", () => ({
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  httpLogger: (req, res, next) => next(), // 👈 Mock valid middleware
}));

beforeAll(() => {
  console.log("🔥 Running global setup before tests...");
});



afterAll(() => {
  console.log("✅ Global teardown after tests...");
});
