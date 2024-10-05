import { loginUser } from "../handlers/user";
import app from "../server";
import request from "supertest";

describe("GET /", () => {
	it("should return a 200 status code", async () => {
		const response = await request(app).get("/");
		expect(response.body.message).toBe("HELLO WORLD!");
		expect(response.status).toBe(200);
	});
});
