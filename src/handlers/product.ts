import prisma from "../db";

// get all products
export const getProducts = async (req: any, res: any, next: any) => {
	try {
		const user: any = await prisma.user.findUnique({
			where: {
				id: req.user.id,
			},
			include: {
				products: true,
			},
		});
		res.status(200);
		res.json({ data: user.products });
	} catch (e) {
		next(e);
	}
};

// get product by id
export const getProductById = async (req: any, res: any, next: any) => {
	try {
		const { id } = req.params.id;

		const product: any = await prisma.product.findFirst({
			where: {
				id,
				belongsToId: req.user.id,
			},
		});
		res.status(200);
		res.json({ data: product });
	} catch (e) {
		next(e);
	}
};

export const createProduct = async (req: any, res: any, next: any) => {
	try {
		const product = await prisma.product.create({
			data: {
				name: req.body.name,
				belongsToId: req.user.id,
			},
		});
		res.status(200);
		res.json({ data: product, message: "Product created successfully!" });
	} catch (e) {
		next(e);
	}
};

export const updateProduct = async (req: any, res: any, next: any) => {
	try {
		const updated: any = await prisma.product.update({
			where: {
				id: req.params.id,
				belongsToId: req.user.id,
			},
			data: {
				name: req.body.name,
			},
		});
		res.status(200);
		res.json({ data: updated, message: "Product updated successfully!" });
	} catch (e) {
		e.type = "input";
		next(e);
	}
};

export const deleteProduct = async (req: any, res: any, next: any) => {
	try {
		const deleted: any = await prisma.product.delete({
			where: {
				id: req.params.id,
				belongsToId: req.user.id,
			},
		});
		res.status(200);
		res.json({ data: deleted, message: "Product deleted successfully!" });
	} catch (e) {
		next(e);
	}
};
