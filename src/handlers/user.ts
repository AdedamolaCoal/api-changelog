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
		res.json({ token, user, message: "User created successfully!" });
		res.status(201);
	} catch (e) {
		// e.type = "input";
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

export const deleteUser = async (req: any, res: any, next: any) => {
	try {
		const userId = req.params.id;

		// to delete user, first find products belonging to user
		const product = await prisma.product.findMany({
			where: {
				belongsToId: userId,
			},
		});

		// delete the products belonging to user
		const deleteProducts = await prisma.product.deleteMany({
			where: {
				belongsToId: userId,
			},
		});

		// delete the user
		// if (userId !== req.user.id) {
		// 	res.status(403);
		// 	res.json({
		// 		message: "You don't have permission to delete this user!",
		// 	});
		// }

		const deleted: any = await prisma.user.delete({
			where: {
				id: userId,
			},
		});
		res.status(200);
		res.json({ data: deleted, message: "User deleted successfully!" });
	} catch (e) {
		console.log(e);
		next(e);
	}
};
