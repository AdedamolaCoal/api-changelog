import prisma from "../db";

export const getUpdates = async (req, res) => {
  const products: any = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });
  const mappedUpdates: any = products.reduce((allUpdates, product) => {
    return [...allUpdates, ...product.updates];
  }, []);

  const message =
    mappedUpdates.length > 0 ? "All updates found." : "No updates found.";
  res.json({ data: mappedUpdates, message });
};

export const getUpdateById = async (req, res) => {
  const update: any = await prisma.update.findUnique({
    where: {
      id: req.params.id,
    },
  });
  res.status(200);
  res.json({ data: update, message: "Update found successfully." });
};

export const createUpdate = async (req, res) => {
  const product: any = await prisma.product.findUnique({
    where: {
      id: req.body.productId,
    },
  });
  if (!product) {
    return res.status(400).json({ message: "Product not found." });
  }
  const update: any = await prisma.update.create({
    data: {
      title: req.body.title,
      body: req.body.body,
      product: {
        connect: {
          id: req.body.productId,
        },
      },
    },
  });
  res.status(201);
  res.json({ data: update, message: "Update created successfully." });
};

export const updateUpdate = async (req, res) => {
  try {
    const update = await prisma.update.findFirst({
      where: {
        id: req.params.id,
        product: {
          belongsToId: req.user.id,
        },
      },
    });

    if (!update) {
      return res.status(400).json({
        message: "Update not found or you don't have permission to modify it.",
      });
    }

    const updatedUpdate = await prisma.update.update({
      where: {
        id: req.params.id,
      },
      data: {
        title: req.body.title,
        body: req.body.body,
      },
    });

    res
      .status(200)
      .json({ data: updatedUpdate, message: "Update updated successfully." });
  } catch (error) {
    console.error("Error updating record:", error);
    res
      .status(500)
      .json({ message: "An error occurred while updating the record." });
  }
};

export const deleteUpdate = async (req, res) => {
  try {
    const update = await prisma.update.findFirst({
      where: {
        id: req.params.id,
        product: {
          belongsToId: req.user.id,
        },
      },
    });

    if (!update) {
      return res.status(404).json({
        message: "Update not found or you don't have permission to delete it.",
      });
    }

    const deletedUpdate = await prisma.update.delete({
      where: {
        id: req.params.id,
      },
    });

    res
      .status(200)
      .json({ data: deletedUpdate, message: "Update deleted successfully." });
  } catch (error) {
    console.error("Error deleting update:", error);
    res
      .status(500)
      .json({ message: "An error occurred while deleting the update." });
  }
};
