import { Router } from "express";
import { body, check, oneOf, validationResult } from "express-validator";
import { handleInputValidation } from "./modules/middleware";
import {
	createProduct,
	deleteProduct,
	getProductById,
	getProducts,
	updateProduct,
} from "./handlers/product";

import {
	createUpdate,
	deleteUpdate,
	getUpdateById,
	getUpdates,
	updateUpdate,
} from "./handlers/update";

const router = Router();

/**
 * Products routes
 */

router.get("/product", getProducts);
router.get("/product/:id", getProductById);

router.post(
	"/product",
	body("name").isString(),
	handleInputValidation,
	createProduct
);

router.put(
	"/product/:id",
	body("name").isString(),
	handleInputValidation,
	updateProduct
);
router.delete("/product/:id", deleteProduct);

/**
 * Update routes
 */

router.get("/update", getUpdates);
router.get("/update/:id", getUpdateById);

router.put(
	"/update/:id",
	body("title").optional(),
	body("body").optional(),
	body("version").optional(),
	oneOf([
		check("status").equals("IN_PROGRESS"),
		check("status").equals("SHIPPED"),
		check("status").equals("DEPRECATED"),
	]),
	updateUpdate
);

router.post(
	"/update",
	body("title").exists().isString(),
	body("body").exists().isString(),
	body("productId").exists().isString(),
	createUpdate
);

router.delete("/update/:id", deleteUpdate);

/**
 * UpdatePoint routes
 */

router.get("/update-point", () => {});
router.get("/update-point/:id", () => {});
router.post(
	"/update-point",
	body("name").exists().isString(),
	body("description").exists().isString(),
	body("updateId").exists().isString(),
	(req, res) => {}
);

router.put(
	"/update-point/:id",
	body("name").optional().isString(),
	body("description").optional().isString(),
	(req, res) => {}
);
router.delete("/update-point/:id", () => {});

router.use((err: any, req: any, res: any, next: any) => {
	res.status(err.status || 500);
	res.json({
		error: {
			message: "Internal Server Error",
		},
	});
});

export default router;
