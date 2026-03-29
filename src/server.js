import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  errorFormat: "pretty",
});

const app = express();

app.use(express.json());

// Create a product (req.body)
app.post("/products", async (req, res) => {
  try {
    const { name, price, stock, categoryId } = req.body;

    const newProduct = await prisma.product.create({
      data: {
        name: String(name),
        price: Number(price),
        stock: Number(stock),
        categoryId: categoryId == null ? null : Number(categoryId)
      }
    });

    res.json(newProduct);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// Get products with query filters (req.query)
// Examples:
// /products?category=Electronics
// /products?minPrice=10&maxPrice=100
app.get("/products", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;

    const products = await prisma.product.findMany({
      where: {
        price: {
          gte: minPrice ? Number(minPrice) : undefined,
          lte: maxPrice ? Number(maxPrice) : undefined
        },
        category: category ? { name: { equals: String(category) } } : undefined
      },
      include: { category: true }
    });

    res.json(products);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// Update product by id (req.params)
app.patch("/products/:productId", async (req, res) => {
  try {
    const productId = Number(req.params.productId);

    if (Number.isNaN(productId)) {
      res.status(400).json({ error: "Invalid productId" });
      return;
    }

    const updated = await prisma.product.update({
      where: { id: productId },
      data: req.body
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

// Delete order by id (req.params)
app.delete("/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const parsedOrderId = Number(orderId);

    if (Number.isNaN(parsedOrderId)) {
      res.status(400).json({ error: "Invalid orderId", params: req.params });
      return;
    }

    const deletedOrder = await prisma.order.delete({
      where: { id: parsedOrderId }
    });

    // Include req.params in response to verify params handling.
    res.json({
      message: "Order deleted",
      params: req.params,
      order: deletedOrder
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).json({ error: "Order not found", params: req.params });
      return;
    }

    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

app.listen(3000, () => console.log("Server running on 3000"));
