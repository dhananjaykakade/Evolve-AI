// testing customError file with test cases

import CustomError from "../../../src/utils/CustomError";

describe("CustomError", () => {
        /**
     * Custom error class for consistent API error handling.
     * @param {String} message - The error message.
     * @param {Number} statusCode - HTTP status statusCode (default: 500).
     * @param {Object} [errors={}] - Optional detailed errors.
     */
    test("should create custom error with default message and statusCode", () => {
        const error = new CustomError();
        expect(error.message).toBe("Internal Server Error");
        expect(error.statusCode).toBe(500);
        expect(error.errors).toEqual({});
    });
    test("should create custom error with detailed errors", () => {
        const error = new CustomError("Test error", 400, {
            field: "name",
            message: "Invalid name",
        });
        expect(error.message).toBe("Test error");
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual({
            field: "name",
            message: "Invalid name",
        });
    });
    test("should create custom error with detailed errors and nested objects", () => {
        const error = new CustomError("Test error", 400, {
            field: "name",
            message: "Invalid name",
            details: {
                nested: "object",
            },
        });
        expect(error.message).toBe("Test error");
        expect(error.statusCode).toBe(400);
        expect(error.errors).toEqual({
            field: "name",
            message: "Invalid name",
            details: {
                nested: "object",
            },
        });
    });
    test("should create custom error with stack trace", () => {
        const error = new CustomError();
        expect(error.stack).toBeDefined();
    });
    test("should create custom error with custom stack trace", () => {
        const error = new CustomError("Test error", 400);
        error.stack = "Custom stack trace";
        expect(error.stack).toBe("Custom stack trace");
    });
    test("should create custom error with custom name", () => {
        const error = new CustomError();
        expect(error.name).toBe("CustomError");
    });
    test("should create custom error with custom name and stack trace", () => {
        const error = new CustomError();
        expect(error.name).toBe("CustomError");
        expect(error.stack).toBeDefined();
    });
    test("should create custom error with custom name and stack trace", () => {
        const error = new CustomError();
        expect(error.name).toBe("CustomError");
        expect(error.stack).toBeDefined();
    });
    test("should create custom error with custom name and stack trace", () => {
        const error = new CustomError();
        expect(error.name).toBe("CustomError");
        expect(error.stack).toBeDefined();
    });

    
}
);