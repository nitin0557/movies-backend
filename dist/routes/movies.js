"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const movie_schema_1 = require("../validation/movie.schema");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
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
                    { title: { contains: search, mode: 'insensitive' } },
                    { director: { contains: search, mode: 'insensitive' } },
                    { location: { contains: search, mode: 'insensitive' } },
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
    }
    catch (err) {
        console.error("❌ Error fetching favorites:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// -------------------------
// CREATE
// -------------------------
router.post("/", authMiddleware_1.authenticate, async (req, res) => {
    try {
        const parsed = movie_schema_1.favoriteCreateSchema.parse(req.body);
        const created = await prisma.favorite.create({ data: parsed });
        res.status(201).json(created);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
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
router.put("/:id", authMiddleware_1.authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        const parsed = movie_schema_1.favoriteUpdateSchema.parse(req.body);
        // Prisma needs ObjectId for MongoDB IDs
        const updated = await prisma.favorite.update({
            where: { id },
            data: parsed,
        });
        res.json(updated);
    }
    catch (err) {
        if (err instanceof zod_1.z.ZodError) {
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
router.delete("/:id", authMiddleware_1.authenticate, async (req, res) => {
    try {
        const id = req.params.id;
        await prisma.favorite.delete({
            where: { id },
        });
        res.status(204).send();
    }
    catch (err) {
        console.error("❌ Error deleting favorite:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
