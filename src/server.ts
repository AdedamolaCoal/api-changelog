import express from "express";
import router from "./router";
import cors from "cors";
import morgan from "morgan";
import { protectRoute } from "./modules/auth";
import { createNewUser, deleteUser, loginUser } from "./handlers/user";

const app = express();

process.on("uncaughtException", (err) => {
	console.error("Uncaught Exception: ", err);
	process.exit(1);
});

process.on("unhandledRejection", (r, p) => {
	console.error("Unhandled Rejection: ", r);
	process.exit(1);
});

/**
 * MIDDLEWARES
 */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
	res.status(200);
	res.json({ message: "HELLO WORLD!" });
});

/**
 * ROUTES
 */
app.use("/api", protectRoute, router);
app.post("/user", createNewUser);
app.post("/login", loginUser);
app.delete("/user/:id", deleteUser);

app.use((err: any, req: any, res: any, next: any) => {
	if (err.type === "auth") {
		res.status(401);
		res.json({ message: "Unauthorized!" });
	} else if (err.type === "input") {
		res.status(400);
		res.json({ message: "Invalid input" });
	} else {
		res.status(500);
		res.json({ message: "Oops! Something went wrong!" });
	}
});

export default app;
