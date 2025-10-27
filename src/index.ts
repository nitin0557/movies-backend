import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moviesRouter from "./routes/movies";
import authRouter from "./routes/auth"; // 👈 new import

// Load environment variables (.env)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter); // 👈 for register/login
app.use("/api/favorites", moviesRouter); // 👈 protected routes later

// Default route
app.get("/", (req, res) => {
  res.send("🎬 Favorite Movies & TV Shows API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
