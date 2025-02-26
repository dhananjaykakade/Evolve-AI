// write test cases to test the app.js

import express from "express";

import app from "../../../src/app.js";
import request from "supertest";
import { error } from "winston";

describe("App", () => {

    test("should return 403 for invalid origin", async () => {
        /*
        this is the response
        {
    "success": false,
    "statusCode": 403,
    "message": "Forbidden access"
}
    */
        const response = await request(app).get("/");
        expect(response.body).toEqual({ success: false, statusCode: 403, message: "Forbidden access" });
    });
    // testing 404 for invalid origin
    test("should return 404 for invalid route", async () => {
        /*
        this is the response
        {
        "success": false,
        "statusCode": 404,
        "message": "Resource not found"

    }
        */
        const response = await request(app).get("/invalid");
        expect(response.body).toEqual({ success: false, statusCode: 404, message: "Resource not found" });

    });
});