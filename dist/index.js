"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const movies_1 = __importDefault(require("./routes/movies"));
const auth_1 = __importDefault(require("./routes/auth")); // 👈 new import
// Load environment variables (.env)
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use("/api/auth", auth_1.default); // 👈 for register/login
app.use("/api/favorites", movies_1.default); // 👈 protected routes later
// Default route
app.get("/", (req, res) => {
    res.send("🎬 Favorite Movies & TV Shows API is running...");
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
