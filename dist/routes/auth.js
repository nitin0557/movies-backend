"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const authValidation_1 = require("../validation/authValidation");
const router = express_1.default.Router();
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecretkey";
router.post("/register", async (req, res) => {
    try {
        const parsed = authValidation_1.registerSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.errors });
        const { name, email, password } = parsed.data;
        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing)
            return res.status(400).json({ message: "User already exists" });
        const hashed = await bcryptjs_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, email, password: hashed },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        res.status(201).json({ message: "User registered", token });
    }
    catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
});
router.post("/login", async (req, res) => {
    try {
        const parsed = authValidation_1.loginSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ error: parsed.error.errors });
        const { email, password } = parsed.data;
        console.log("Login attempt for:", email);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            console.log("User not found:", email);
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        console.log("Password match:", isMatch);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid email or password" });
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
            expiresIn: "1h",
        });
        return res.json({ message: "Login successful", token });
    }
    catch (err) {
        console.error("🔥 Login Error:", err);
        const errorMessage = err instanceof Error ? err.message : String(err);
        return res.status(500).json({ message: "Server error", error: errorMessage });
    }
});
exports.default = router;
