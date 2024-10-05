import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../modules/auth";

/**
 * USER HANDLERS
 */

// create new user
export const createNewUser = async (req: any, res: any, next: any) => {
	try {
		const { username, password } = req.body;

		if (!password) {
			return res.status(400).json({ error: "Password is required!" });
		}

		const user = await prisma.user.create({
			data: {
				username,
				password: await hashPassword(password),
			},
		});

		const token = createJWT(user);
		res.json({ token });
		res.status(201);
	} catch (e) {
		e.type = "input";
		next(e);
	}
};

export const loginUser = async (req: any, res: any, next: any) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username: req.body.username,
			},
		});

		if (user) {
			const isValid = await comparePassword(req.body.password, user.password);
			if (isValid) {
				const token = createJWT(user);
				res.json({ token });
			} else {
				res.status(401);
				res.json({ message: "Invalid username or password" });
				return;
			}
		}
	} catch (e) {
		e.type = "input";
		next(e);
	}
};
