import * as user from "../user";

// unit test and integration test
describe("POST /signup", () => {
	it("should create a new user", async () => {
		// both req and res are spies: they are used to check if the function is called because the function needs parameters.
		const req = { body: { username: "adunni", password: "adunni" } };
		const res = {
			json({ token }) {
				console.log(token);
				expect(token).toBeTruthy();
			},
		};
		await user.createNewUser(req, res, () => {});
	});
});
