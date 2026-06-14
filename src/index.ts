import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moviesRouter from "./routes/movies";
import authRouter from "./routes/auth"; 
import airouter from "./routes/ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter); 
app.use("/api/favorites", moviesRouter); 
app.use("/api/ai", airouter);


app.get("/", (req, res) => {
  res.send("🎬 Favorite Movies & TV Shows API is running...");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server listening on port ${PORT}`));
