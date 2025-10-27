import express from "express";
import { PrismaClient, Prisma } from "@prisma/client";
import { z } from "zod";
import { favoriteCreateSchema, favoriteUpdateSchema } from "../validation/movie.schema";
import { authenticate } from "../middleware/authMiddleware";


const router = express.Router();
const prisma = new PrismaClient();

// -------------------------
// GET (with pagination + search)
// -------------------------
router.get("/", async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search?.toString() || "";
    const skip = (page - 1) * limit;

    // Build search query conditionally
    const where = search
      ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' as any } },
            { director: { contains: search, mode: 'insensitive' as any } },
            { location: { contains: search, mode: 'insensitive' as any } },
          ],
        }
      : {};

    // Run queries concurrently
    const [items, total] = await Promise.all([
      prisma.favorite.findMany({
        where,
        take: limit,
        skip,
        orderBy: { createdAt: "desc" },
      }),
      prisma.favorite.count({ where }),
    ]);

    res.json({
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error fetching favorites:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------
// CREATE
// -------------------------
router.post("/",authenticate, async (req, res) => {
  try {
    const parsed = favoriteCreateSchema.parse(req.body);
    const created = await prisma.favorite.create({ data: parsed });
    res.status(201).json(created);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.issues,
      });
    }
    console.error("❌ Error creating favorite:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------
// UPDATE
// -------------------------
router.put("/:id",authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    const parsed = favoriteUpdateSchema.parse(req.body);

    // Prisma needs ObjectId for MongoDB IDs
    const updated = await prisma.favorite.update({
      where: { id },
      data: parsed,
    });

    res.json(updated);
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        error: "Validation failed",
        details: err.issues,
      });
    }
    console.error("❌ Error updating favorite:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// -------------------------
// DELETE
// -------------------------
router.delete("/:id",authenticate, async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.favorite.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error("❌ Error deleting favorite:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
